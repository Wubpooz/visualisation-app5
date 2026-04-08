from __future__ import annotations

import argparse
import json
import os
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterable, cast

import pandas as pd
from datasets import load_dataset, load_from_disk


PROVENANCE_COLUMNS = {
    "dataset_id",
    "wave",
    "source_file",
    "metadata_file",
    "source_row_index",
    "source_key_raw",
    "dimension_order_raw",
    "dimension_order",
    "time_period_raw",
    "time_period",
    "time_period_year",
    "observation_cell_raw",
    "observation_raw",
    "observation",
    "observation_value",
    "duration_minutes",
    "is_missing",
    "status_flag",
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Audit cross-wave harmonization compatibility in HETUS observations, "
            "including ACL00/ACL18 overlap, nullability, and merge candidates."
        )
    )
    parser.add_argument(
        "--repo-id",
        type=str,
        default=os.environ.get("HF_DATASET_REPO", "Bluefir/hetus-time-use"),
        help="HF dataset repository id (default: env HF_DATASET_REPO or Bluefir/hetus-time-use)",
    )
    parser.add_argument(
        "--config",
        type=str,
        default="observations",
        help="Dataset config to analyze (default: observations)",
    )
    parser.add_argument(
        "--split",
        type=str,
        default="train",
        help="Dataset split (default: train)",
    )
    parser.add_argument(
        "--token-env",
        type=str,
        default="HF_TOKEN",
        help="Environment variable holding HF token for private repos.",
    )
    parser.add_argument(
        "--local-dataset-dir",
        type=Path,
        default=Path("hf_export") / "hf_dataset",
        help="Optional local dataset path created by save_to_disk (default: hf_export/hf_dataset)",
    )
    parser.add_argument(
        "--output-json",
        type=Path,
        default=Path("hf_export") / "harmonization_audit_report.json",
        help="Output JSON report path.",
    )
    parser.add_argument(
        "--output-md",
        type=Path,
        default=Path("hf_export") / "harmonization_audit_report.md",
        help="Output Markdown report path.",
    )
    parser.add_argument(
        "--top-n",
        type=int,
        default=30,
        help="How many top rows to keep for missingness and merge-candidate tables.",
    )
    parser.add_argument(
        "--max-values-in-report",
        type=int,
        default=120,
        help="Maximum distinct values per wave/domain before truncating value lists.",
    )
    return parser.parse_args()


def is_missing(series: pd.Series) -> pd.Series:
    s = series.astype("string")
    return s.isna() | (s.str.strip() == "")


def non_missing(series: pd.Series) -> pd.Series:
    return ~is_missing(series)


def sorted_values(series: pd.Series) -> list[str]:
    return sorted(set(series.astype(str).str.strip().tolist()))


def load_observations(args: argparse.Namespace) -> pd.DataFrame:
    token = os.environ.get(args.token_env, "").strip() or None

    if args.local_dataset_dir is not None and args.local_dataset_dir.exists():
        dataset_dict = load_from_disk(str(args.local_dataset_dir))
        if not hasattr(dataset_dict, "keys"):
            raise TypeError(
                "Expected a DatasetDict from --local-dataset-dir, but got a single dataset object."
            )

        dataset_dict_any = cast(Any, dataset_dict)
        if args.config not in dataset_dict:
            available = ", ".join(str(k) for k in dataset_dict_any.keys())
            raise KeyError(
                f"Config '{args.config}' not found in local dataset. Available: {available}"
            )
        dataset = dataset_dict_any[args.config]
    else:
        dataset = load_dataset(args.repo_id, args.config, split=args.split, token=token)

    if not hasattr(dataset, "to_pandas"):
        raise TypeError("Expected a Dataset-like object with to_pandas().")

    return cast(pd.DataFrame, dataset.to_pandas())


def acl_major_bucket(code: str) -> str | None:
    raw = str(code).strip()
    if not raw:
        return None
    if raw == "TOTAL":
        return "TOTAL"
    match = re.match(r"^AC(\d)", raw)
    if match:
        return f"AC{match.group(1)}"
    if raw.startswith("AC_") or raw == "NSP":
        return "OTHER"
    return None


def acl_canonical_numeric(code: str) -> str:
    raw = str(code).strip().upper()
    if not raw:
        return ""
    if raw == "TOTAL":
        return "TOTAL"
    digits = "".join(ch for ch in raw if ch.isdigit())
    return digits if digits else raw


def analyze_acl(df: pd.DataFrame, waves: list[str]) -> dict[str, Any]:
    if "acl00" not in df.columns or "acl18" not in df.columns:
        return {"available": False, "reason": "Columns acl00 and/or acl18 missing"}

    mask_00 = non_missing(df["acl00"])
    mask_18 = non_missing(df["acl18"])

    codes_00 = sorted_values(df.loc[mask_00, "acl00"])
    codes_18 = sorted_values(df.loc[mask_18, "acl18"])

    set_00 = set(codes_00)
    set_18 = set(codes_18)
    shared_raw = sorted(set_00 & set_18)
    only_00 = sorted(set_00 - set_18)
    only_18 = sorted(set_18 - set_00)

    canon_00 = {acl_canonical_numeric(code) for code in set_00 if acl_canonical_numeric(code)}
    canon_18 = {acl_canonical_numeric(code) for code in set_18 if acl_canonical_numeric(code)}

    by_wave: list[dict[str, Any]] = []
    for wave in waves:
        group = df[df["wave"].astype(str) == wave]
        group_mask_00 = non_missing(group["acl00"])
        group_mask_18 = non_missing(group["acl18"])
        by_wave.append(
            {
                "wave": wave,
                "rows": int(len(group)),
                "acl00_non_missing": int(group_mask_00.sum()),
                "acl18_non_missing": int(group_mask_18.sum()),
                "both_non_missing": int((group_mask_00 & group_mask_18).sum()),
            }
        )

    pct_rows_00_on_shared = 0.0
    rows_00_non_missing = int(mask_00.sum())
    if rows_00_non_missing:
        pct_rows_00_on_shared = (
            df.loc[mask_00, "acl00"].astype(str).str.strip().isin(shared_raw).mean() * 100
        )

    pct_rows_18_on_shared = 0.0
    rows_18_non_missing = int(mask_18.sum())
    if rows_18_non_missing:
        pct_rows_18_on_shared = (
            df.loc[mask_18, "acl18"].astype(str).str.strip().isin(shared_raw).mean() * 100
        )

    major_by_wave: dict[str, dict[str, Any]] = {}
    for wave, col in [("2000_2010", "acl00"), ("2020", "acl18")]:
        if wave not in waves:
            continue
        subset = df[df["wave"].astype(str) == wave].copy()
        subset = subset[non_missing(subset[col])].copy()
        majors = subset[col].astype(str).str.strip().map(acl_major_bucket)
        coverage_pct = float(majors.notna().mean() * 100) if len(majors) else 0.0
        major_by_wave[wave] = {
            "rows": int(len(subset)),
            "major_mappable_pct": round(coverage_pct, 3),
            "major_counts": {k: int(v) for k, v in majors.value_counts(dropna=False).to_dict().items()},
        }

    non_standard_acl00: dict[str, int] = {}
    subset_00 = df[df["wave"].astype(str) == "2000_2010"] if "2000_2010" in waves else df.iloc[0:0]
    if not subset_00.empty:
        raw_00 = subset_00.loc[non_missing(subset_00["acl00"]), "acl00"].astype(str).str.strip()
        non_std = raw_00[~raw_00.str.match(r"^(AC\d.*|TOTAL)$")]
        non_standard_acl00 = {k: int(v) for k, v in non_std.value_counts().to_dict().items()}

    return {
        "available": True,
        "counts": {
            "acl00_non_missing": rows_00_non_missing,
            "acl18_non_missing": rows_18_non_missing,
            "both_non_missing": int((mask_00 & mask_18).sum()),
            "only_acl00": int((mask_00 & ~mask_18).sum()),
            "only_acl18": int((~mask_00 & mask_18).sum()),
            "neither": int((~mask_00 & ~mask_18).sum()),
        },
        "by_wave": by_wave,
        "raw_code_overlap": {
            "unique_acl00": len(set_00),
            "unique_acl18": len(set_18),
            "shared": len(shared_raw),
            "acl00_only": len(only_00),
            "acl18_only": len(only_18),
            "shared_codes": shared_raw,
            "acl00_only_codes": only_00,
            "acl18_only_codes": only_18,
            "pct_acl00_rows_on_shared_codes": round(float(pct_rows_00_on_shared), 3),
            "pct_acl18_rows_on_shared_codes": round(float(pct_rows_18_on_shared), 3),
        },
        "normalized_digits_overlap": {
            "unique_acl00": len(canon_00),
            "unique_acl18": len(canon_18),
            "shared": len(canon_00 & canon_18),
            "acl00_only": len(canon_00 - canon_18),
            "acl18_only": len(canon_18 - canon_00),
            "acl00_only_values": sorted(canon_00 - canon_18),
            "acl18_only_values": sorted(canon_18 - canon_00),
        },
        "major_bucket_harmonization": {
            "by_wave": major_by_wave,
            "non_standard_acl00_codes": non_standard_acl00,
        },
    }


def analyze_nullability(df: pd.DataFrame, waves: list[str], top_n: int) -> dict[str, Any]:
    per_column: list[dict[str, Any]] = []
    strict_null: list[str] = []
    wave_specific: list[dict[str, Any]] = []

    total_rows = len(df)

    for col in df.columns:
        mask = non_missing(df[col])
        non_missing_count = int(mask.sum())
        by_wave = {
            wave: int(non_missing(df[df["wave"].astype(str) == wave][col]).sum()) for wave in waves
        }

        row = {
            "column": col,
            "non_missing": non_missing_count,
            "missing": int(total_rows - non_missing_count),
            "missing_pct": round((total_rows - non_missing_count) * 100.0 / total_rows, 3),
            "by_wave": by_wave,
        }
        per_column.append(row)

        if non_missing_count == 0:
            strict_null.append(col)

        active_waves = [wave for wave, cnt in by_wave.items() if cnt > 0]
        if len(active_waves) == 1:
            wave_specific.append(
                {
                    "column": col,
                    "wave": active_waves[0],
                    "non_missing": non_missing_count,
                }
            )

    per_column_sorted = sorted(per_column, key=lambda x: x["missing_pct"], reverse=True)
    highest_missing = [row for row in per_column_sorted if row["non_missing"] > 0][: max(top_n, 1)]

    return {
        "strict_null_columns_count": len(strict_null),
        "strict_null_columns": strict_null,
        "wave_specific_columns": sorted(wave_specific, key=lambda x: (x["wave"], x["column"])),
        "highest_missing_columns": highest_missing,
        "all_columns": per_column,
    }


def derive_dimension_columns(columns: Iterable[str]) -> list[str]:
    return [col for col in columns if col not in PROVENANCE_COLUMNS]


def collect_wave_values(df: pd.DataFrame, waves: list[str], col: str) -> dict[str, set[str]]:
    by_wave_values: dict[str, set[str]] = {}
    for wave in waves:
        subset = df[df["wave"].astype(str) == wave]
        values = sorted_values(subset.loc[non_missing(subset[col]), col])
        by_wave_values[wave] = set(values)
    return by_wave_values


def classify_domain_overlap(
    by_wave_values: dict[str, set[str]],
    waves: list[str],
) -> tuple[str, set[str], float]:
    active_waves = [wave for wave, vals in by_wave_values.items() if vals]
    if len(active_waves) < len(waves):
        return "wave_specific", set(), 0.0

    shared_values = set.intersection(*(by_wave_values[wave] for wave in waves))
    union_values = set.union(*(by_wave_values[wave] for wave in waves))
    jaccard = float(len(shared_values) / len(union_values)) if union_values else 1.0

    if jaccard >= 0.999999:
        return "aligned", shared_values, jaccard
    if not shared_values:
        return "disjoint", shared_values, jaccard
    return "partial_overlap", shared_values, jaccard


def domain_values_payload(
    by_wave_values: dict[str, set[str]],
    waves: list[str],
    shared_values: set[str],
    max_values_in_report: int,
) -> dict[str, Any]:
    if all(len(vals) <= max_values_in_report for vals in by_wave_values.values()):
        payload: dict[str, Any] = {
            "values_by_wave": {wave: sorted(vals) for wave, vals in by_wave_values.items()},
            "shared_values": sorted(shared_values),
        }
        if len(waves) == 2:
            left, right = waves
            payload[f"{left}_only_values"] = sorted(by_wave_values[left] - by_wave_values[right])
            payload[f"{right}_only_values"] = sorted(by_wave_values[right] - by_wave_values[left])
        return payload

    return {
        "samples": {
            wave: sorted(vals)[:max_values_in_report]
            for wave, vals in by_wave_values.items()
        },
        "shared_sample": sorted(shared_values)[:max_values_in_report],
    }


def summarize_domain_rows(domains: dict[str, Any], waves: list[str]) -> list[dict[str, Any]]:
    rows = [
        {
            "column": col,
            "classification": entry["classification"],
            "shared_count": entry["shared_count"],
            "jaccard": entry["jaccard"],
            **{f"unique_{wave}": entry["counts_by_wave"][wave] for wave in waves},
        }
        for col, entry in domains.items()
    ]
    return sorted(
        rows,
        key=lambda row: (
            row["classification"],
            -row["jaccard"],
            row["column"],
        ),
    )


def analyze_domain_overlap(
    df: pd.DataFrame,
    waves: list[str],
    dimension_columns: list[str],
    max_values_in_report: int,
) -> dict[str, Any]:
    domains: dict[str, Any] = {}

    for col in dimension_columns:
        by_wave_values = collect_wave_values(df, waves, col)
        counts_by_wave = {wave: len(vals) for wave, vals in by_wave_values.items()}
        classification, shared_values, jaccard = classify_domain_overlap(by_wave_values, waves)

        domain_entry: dict[str, Any] = {
            "classification": classification,
            "counts_by_wave": counts_by_wave,
            "shared_count": len(shared_values),
            "jaccard": round(jaccard, 3),
        }
        domain_entry.update(
            domain_values_payload(
                by_wave_values=by_wave_values,
                waves=waves,
                shared_values=shared_values,
                max_values_in_report=max_values_in_report,
            )
        )

        domains[col] = domain_entry

    return {
        "columns": domains,
        "summary": summarize_domain_rows(domains, waves),
    }


def column_stem(name: str) -> str:
    base = name.lower().strip()
    base = re.sub(r"\d+", "", base)
    return base


def merge_candidate_reason(
    *,
    jaccard: float,
    stem_match: bool,
    prefix_match: bool,
) -> str | None:
    if jaccard >= 0.75:
        return "high_value_overlap"
    if stem_match and jaccard >= 0.30:
        return "same_name_stem_and_partial_value_overlap"
    if prefix_match and jaccard >= 0.50:
        return "same_prefix_and_moderate_value_overlap"
    return None


def build_merge_candidate(
    *,
    col_a: str,
    col_b: str,
    wave_map: dict[str, str],
    non_missing_masks: dict[str, pd.Series],
    value_sets: dict[str, set[str]],
) -> dict[str, Any] | None:
    if wave_map[col_a] == wave_map[col_b]:
        return None

    both_non_missing = int((non_missing_masks[col_a] & non_missing_masks[col_b]).sum())
    if both_non_missing != 0:
        return None

    values_a = value_sets[col_a]
    values_b = value_sets[col_b]
    if not values_a or not values_b:
        return None

    shared = values_a & values_b
    union = values_a | values_b
    jaccard = float(len(shared) / len(union)) if union else 1.0

    stem_match = column_stem(col_a) == column_stem(col_b)
    prefix_match = col_a.split("_", 1)[0].lower() == col_b.split("_", 1)[0].lower()
    reason = merge_candidate_reason(
        jaccard=jaccard,
        stem_match=stem_match,
        prefix_match=prefix_match,
    )
    if reason is None:
        return None

    return {
        "column_a": col_a,
        "wave_a": wave_map[col_a],
        "column_b": col_b,
        "wave_b": wave_map[col_b],
        "unique_a": len(values_a),
        "unique_b": len(values_b),
        "shared_unique": len(shared),
        "jaccard": round(jaccard, 3),
        "reason": reason,
        "shared_values_sample": sorted(shared)[:20],
    }


def find_merge_candidates(
    df: pd.DataFrame,
    wave_specific_columns: list[dict[str, Any]],
    top_n: int,
) -> list[dict[str, Any]]:
    cols = [entry["column"] for entry in wave_specific_columns]
    wave_map = {entry["column"]: entry["wave"] for entry in wave_specific_columns}

    non_missing_masks = {col: non_missing(df[col]) for col in cols}
    value_sets = {
        col: set(df.loc[non_missing_masks[col], col].astype(str).str.strip()) for col in cols
    }

    candidates: list[dict[str, Any]] = []
    for i, col_a in enumerate(cols):
        for col_b in cols[i + 1 :]:
            candidate = build_merge_candidate(
                col_a=col_a,
                col_b=col_b,
                wave_map=wave_map,
                non_missing_masks=non_missing_masks,
                value_sets=value_sets,
            )
            if candidate is not None:
                candidates.append(candidate)

    candidates = sorted(
        candidates,
        key=lambda row: (row["jaccard"], row["shared_unique"], row["column_a"], row["column_b"]),
        reverse=True,
    )
    return candidates[: max(top_n, 1)]


def markdown_table(rows: list[dict[str, Any]], columns: list[str]) -> str:
    if not rows:
        return "_None_"

    lines = [
        "| " + " | ".join(columns) + " |",
        "| " + " | ".join(["---"] * len(columns)) + " |",
    ]
    for row in rows:
        cells = []
        for col in columns:
            value = row.get(col, "")
            if isinstance(value, float):
                cells.append(f"{value:.3f}")
            else:
                cells.append(str(value))
        lines.append("| " + " | ".join(cells) + " |")
    return "\n".join(lines)


def write_markdown_report(report: dict[str, Any], path: Path, top_n: int) -> None:
    acl = report["acl_compatibility"]
    nullability = report["nullability"]
    domain_overlap = report["domain_overlap"]

    acl_counts = acl.get("counts", {}) if acl.get("available") else {}
    by_wave = acl.get("by_wave", []) if acl.get("available") else []
    raw_overlap = acl.get("raw_code_overlap", {}) if acl.get("available") else {}

    content: list[str] = []
    content.append("# HETUS Harmonization Audit")
    content.append("")
    content.append(f"Generated at: `{report['generated_at_utc']}`")
    content.append("")
    content.append("## Dataset")
    content.append("")
    content.append(
        f"- Rows: **{report['dataset']['rows']}**  "+
        f"Columns: **{report['dataset']['columns']}**  "+
        f"Waves: **{', '.join(report['dataset']['waves'])}**"
    )
    content.append("")

    content.append("## ACL00 vs ACL18")
    content.append("")
    if not acl.get("available"):
        content.append(f"- Not available: {acl.get('reason', 'unknown reason')}")
    else:
        content.append(
            "- Non-missing counts: "
            f"`acl00={acl_counts.get('acl00_non_missing', 0)}`, "
            f"`acl18={acl_counts.get('acl18_non_missing', 0)}`, "
            f"`both={acl_counts.get('both_non_missing', 0)}`"
        )
        content.append(
            "- Raw code overlap: "
            f"`shared={raw_overlap.get('shared', 0)}`, "
            f"`acl00_only={raw_overlap.get('acl00_only', 0)}`, "
            f"`acl18_only={raw_overlap.get('acl18_only', 0)}`"
        )
        content.append("")
        content.append(
            markdown_table(
                by_wave,
                ["wave", "rows", "acl00_non_missing", "acl18_non_missing", "both_non_missing"],
            )
        )
    content.append("")

    content.append("## Nullability")
    content.append("")
    content.append(
        f"- Strict-null columns: **{nullability['strict_null_columns_count']}**"
    )
    content.append(
        "- Wave-specific columns: "
        + ", ".join(
            f"`{item['column']} ({item['wave']})`"
            for item in nullability["wave_specific_columns"]
        )
    )
    content.append("")
    content.append(
        markdown_table(
            nullability["highest_missing_columns"][: max(top_n, 1)],
            ["column", "non_missing", "missing", "missing_pct"],
        )
    )
    content.append("")

    content.append("## Suggested merge candidates (wave-specific columns)")
    content.append("")
    content.append(
        markdown_table(
            report["merge_candidates"],
            [
                "column_a",
                "wave_a",
                "column_b",
                "wave_b",
                "shared_unique",
                "jaccard",
                "reason",
            ],
        )
    )
    content.append("")

    content.append("## Cross-wave domain overlap (dimension columns)")
    content.append("")
    content.append(
        markdown_table(
            domain_overlap["summary"][: max(top_n, 1)],
            [
                "column",
                "classification",
                "shared_count",
                "jaccard",
                *(f"unique_{wave}" for wave in report["dataset"]["waves"]),
            ],
        )
    )

    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("\n".join(content), encoding="utf-8")


def build_report(args: argparse.Namespace) -> dict[str, Any]:
    df = load_observations(args)
    waves = sorted(set(df["wave"].dropna().astype(str).tolist())) if "wave" in df.columns else []

    nullability = analyze_nullability(df, waves, args.top_n)
    dimensions = derive_dimension_columns(df.columns)
    domain_overlap = analyze_domain_overlap(
        df=df,
        waves=waves,
        dimension_columns=dimensions,
        max_values_in_report=max(args.max_values_in_report, 20),
    )
    merge_candidates = find_merge_candidates(
        df=df,
        wave_specific_columns=nullability["wave_specific_columns"],
        top_n=args.top_n,
    )

    report = {
        "generated_at_utc": datetime.now(timezone.utc).isoformat(),
        "input": {
            "repo_id": args.repo_id,
            "config": args.config,
            "split": args.split,
            "token_env": args.token_env,
            "local_dataset_dir": str(args.local_dataset_dir) if args.local_dataset_dir else None,
        },
        "dataset": {
            "rows": int(len(df)),
            "columns": int(len(df.columns)),
            "waves": waves,
            "dimension_columns": dimensions,
        },
        "acl_compatibility": analyze_acl(df, waves),
        "nullability": nullability,
        "merge_candidates": merge_candidates,
        "domain_overlap": domain_overlap,
    }

    return report


def main() -> None:
    args = parse_args()
    report = build_report(args)

    args.output_json.parent.mkdir(parents=True, exist_ok=True)
    args.output_json.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")

    write_markdown_report(report, args.output_md, args.top_n)

    acl_counts = report["acl_compatibility"].get("counts", {})
    print(f"Saved JSON report: {args.output_json.resolve()}")
    print(f"Saved Markdown report: {args.output_md.resolve()}")
    print(
        "Dataset summary: "
        f"rows={report['dataset']['rows']} cols={report['dataset']['columns']} "
        f"waves={report['dataset']['waves']}"
    )
    if acl_counts:
        print(
            "ACL non-missing rows: "
            f"acl00={acl_counts.get('acl00_non_missing', 0)} "
            f"acl18={acl_counts.get('acl18_non_missing', 0)} "
            f"both={acl_counts.get('both_non_missing', 0)}"
        )
    print(
        "Nullability summary: "
        f"strict_null={report['nullability']['strict_null_columns_count']} "
        f"wave_specific={len(report['nullability']['wave_specific_columns'])} "
        f"merge_candidates={len(report['merge_candidates'])}"
    )


if __name__ == "__main__":
    main()
