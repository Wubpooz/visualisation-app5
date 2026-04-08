from __future__ import annotations

import argparse
import json
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, cast

import pandas as pd
from datasets import Dataset, DatasetDict, load_dataset, load_from_disk
from huggingface_hub import hf_hub_download, list_repo_files

from add_unified_acl18_column import ACL00_TO_ACL18_MAPPING

AGE_GROUP_SOURCE_CODES: dict[str, tuple[str, ...]] = {
    "10-24": ("Y15-20", "Y20-24", "Y10-14", "Y15-24", "Y15-29"),
    "25-44": ("Y25-44", "Y25-34", "Y30-44", "Y35-44"),
    "45-64": ("Y45-64", "Y45-54", "Y55-64"),
    "65+": ("Y65-74", "Y_GE65", "Y_GE75"),
}

AGE_GROUP_ORDER = ["10-24", "25-44", "45-64", "65+"]
AGE_GROUP_MAPPING = {
    source_code: age_group
    for age_group, source_codes in AGE_GROUP_SOURCE_CODES.items()
    for source_code in source_codes
}

DEFAULT_ACTIVITY_CATEGORIES = [
    "AC01",
    "AC812",
    "AC72",
    "AC512_513_519",
    "AC52",
    "AC611",
    "AC321",
    "AC382_383",
    "AC1_2",
    "AC910",
]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Extract the average time spent in each activity category, by harmonized age "
            "group and year, and save the result to JSON."
        )
    )
    parser.add_argument(
        "--repo-id",
        type=str,
        default=os.environ.get("HF_DATASET_REPO", "Bluefir/hetus-time-use"),
        help="HF dataset repository id (default: env HF_DATASET_REPO or Bluefir/hetus-time-use).",
    )
    parser.add_argument(
        "--config",
        type=str,
        default="observations",
        help="Dataset config to load (default: observations).",
    )
    parser.add_argument(
        "--split",
        type=str,
        default="train",
        help="Dataset split to load (default: train).",
    )
    parser.add_argument(
        "--token-env",
        type=str,
        default="HF_TOKEN",
        help="Environment variable holding the HF token for private repos.",
    )
    parser.add_argument(
        "--local-dataset-dir",
        type=Path,
        default=Path("hf_export") / "hf_dataset_unified_acl",
        help=(
            "Optional local dataset path created by save_to_disk. If it exists it is used; "
            "otherwise the script falls back to the Hugging Face dataset."
        ),
    )
    parser.add_argument(
        "--geo",
        type=str,
        default="DE",
        help="Geography filter (default: DE).",
    )
    parser.add_argument(
        "--sex",
        type=str,
        default="T",
        help="Sex filter (default: T).",
    )
    parser.add_argument(
        "--unit",
        type=str,
        default="TIME_SP",
        help="Unit filter (default: TIME_SP, time spent).",
    )
    parser.add_argument(
        "--categories",
        type=str,
        default="",
        help=(
            "Comma-separated list of unified ACL codes to extract. If omitted, the script "
            "uses the curated stable category list from the design notes."
        ),
    )
    parser.add_argument(
        "--all-categories",
        action="store_true",
        help="Extract all available activity categories instead of the curated list.",
    )
    parser.add_argument(
        "--include-partial-categories",
        action="store_true",
        help="Keep categories even when they are not present in every selected year.",
    )
    parser.add_argument(
        "--output-json",
        type=Path,
        default=Path("hf_export") / "age_activity_year_average.json",
        help="Output JSON path.",
    )
    return parser.parse_args()


def normalize_text(value: Any) -> str:
    if value is None or pd.isna(value):
        return ""

    text = str(value).strip()
    return "" if text.lower() == "nan" else text


def load_observations(args: argparse.Namespace) -> pd.DataFrame:
    token = os.environ.get(args.token_env, "").strip() or None

    if args.local_dataset_dir and args.local_dataset_dir.exists():
        local_data = load_from_disk(str(args.local_dataset_dir))
        if isinstance(local_data, DatasetDict):
            if args.config not in local_data:
                available = ", ".join(str(key) for key in local_data.keys())
                raise KeyError(
                    f"Config '{args.config}' not found in local dataset. Available: {available}"
                )
            dataset = local_data[args.config]
        else:
            dataset = cast(Dataset, local_data)

        return cast(pd.DataFrame, dataset.to_pandas())

    try:
        dataset = load_dataset(args.repo_id, args.config, split=args.split, token=token)
        return cast(pd.DataFrame, dataset.to_pandas())
    except Exception as exc:
        print(
            "Warning: load_dataset failed for the remote dataset; "
            "falling back to direct parquet download. "
            f"Reason: {exc}"
        )
        return load_remote_parquet_observations(args, token)


def load_remote_parquet_observations(
    args: argparse.Namespace,
    token: str | None,
) -> pd.DataFrame:
    repo_files = list_repo_files(args.repo_id, repo_type="dataset", token=token)
    parquet_files = sorted(
        path
        for path in repo_files
        if path.startswith(f"{args.config}/")
        and Path(path).name.startswith(f"{args.split}-")
        and path.endswith(".parquet")
    )
    if not parquet_files:
        raise FileNotFoundError(
            "No parquet shard found for the requested dataset config/split: "
            f"config={args.config} split={args.split}"
        )

    frames: list[pd.DataFrame] = []
    for parquet_file in parquet_files:
        local_path = hf_hub_download(
            repo_id=args.repo_id,
            filename=parquet_file,
            repo_type="dataset",
            token=token,
        )
        frames.append(pd.read_parquet(local_path))

    return pd.concat(frames, ignore_index=True)


def validate_required_columns(df: pd.DataFrame) -> None:
    required = {"duration_minutes", "age", "geo", "sex", "unit"}
    missing = sorted(required - set(df.columns))
    if missing:
        raise KeyError(f"Dataset is missing required column(s): {', '.join(missing)}")

    if "time_period_year" not in df.columns and "time_period" not in df.columns:
        raise KeyError("Dataset must contain either 'time_period_year' or 'time_period'.")

    if not {"unified_acl_codes", "acl00", "acl18"}.intersection(df.columns):
        raise KeyError(
            "Dataset must contain 'unified_acl_codes' or one of 'acl00'/'acl18' to identify activities."
        )


def build_activity_categories(df: pd.DataFrame) -> tuple[pd.Series, str]:
    if "unified_acl_codes" in df.columns:
        unified = df["unified_acl_codes"].map(normalize_text)
        if (unified != "").any():
            return unified, "unified_acl_codes"

    acl18 = (
        df["acl18"].map(normalize_text)
        if "acl18" in df.columns
        else pd.Series("", index=df.index, dtype="object")
    )
    acl00 = (
        df["acl00"].map(normalize_text)
        if "acl00" in df.columns
        else pd.Series("", index=df.index, dtype="object")
    )
    mapped_acl00 = acl00.map(lambda code: ACL00_TO_ACL18_MAPPING.get(code, code) if code else "")
    unified = acl18.where(acl18 != "", mapped_acl00)
    return unified, "derived_from_acl00_acl18"


def build_years(df: pd.DataFrame) -> pd.Series:
    source_column = "time_period_year" if "time_period_year" in df.columns else "time_period"
    return pd.to_numeric(df[source_column], errors="coerce")


def prepare_filtered_data(
    df: pd.DataFrame,
    args: argparse.Namespace,
) -> tuple[pd.DataFrame, str]:
    working = df.copy()
    activity_categories, category_source = build_activity_categories(working)

    working["activity_category"] = activity_categories
    working["age_raw"] = working["age"].map(normalize_text)
    working["age_group"] = working["age_raw"].map(lambda age: AGE_GROUP_MAPPING.get(age, ""))
    working["minutes"] = pd.to_numeric(working["duration_minutes"], errors="coerce")
    working["year"] = build_years(working)
    working["geo_norm"] = working["geo"].map(normalize_text)
    working["sex_norm"] = working["sex"].map(normalize_text)
    working["unit_norm"] = working["unit"].map(normalize_text)

    if "freq" in working.columns:
        working["freq_norm"] = working["freq"].map(normalize_text)
    else:
        working["freq_norm"] = ""

    filtered = working[
        (working["freq_norm"].isin(["", "A"]))
        & (working["age_group"] != "")
        & (working["activity_category"] != "")
        & working["minutes"].notna()
        & working["year"].notna()
    ][["year", "age_group", "activity_category", "minutes", "age_raw"]].copy()

    filtered["year"] = filtered["year"].astype(int)
    return filtered, category_source


def aggregate_minutes(filtered: pd.DataFrame) -> pd.DataFrame:
    grouped = (
        filtered.groupby(["year", "age_group", "activity_category"], as_index=False)
        .agg(
            average_minutes=("minutes", "mean"),
            observation_count=("minutes", "size"),
        )
        .sort_values(["year", "age_group", "activity_category"])
        .reset_index(drop=True)
    )
    return grouped


def select_categories(
    grouped: pd.DataFrame,
    args: argparse.Namespace,
) -> tuple[pd.DataFrame, list[int], list[str], list[str], bool]:
    years = sorted(grouped["year"].unique().tolist())
    selected = grouped.copy()

    if not args.include_partial_categories:
        category_year_coverage = selected.groupby("activity_category")["year"].nunique()
        eligible_categories = category_year_coverage[category_year_coverage == len(years)].index.tolist()
        selected = selected[selected["activity_category"].isin(eligible_categories)].copy()

    available_categories = set(selected["activity_category"].astype(str).tolist())
    requested_categories = [code.strip() for code in args.categories.split(",") if code.strip()]
    using_default_categories = not args.all_categories and not requested_categories

    if args.all_categories:
        categories = sorted(available_categories)
        missing_categories: list[str] = []
    else:
        desired_categories = requested_categories or DEFAULT_ACTIVITY_CATEGORIES
        categories = [code for code in desired_categories if code in available_categories]
        missing_categories = [code for code in desired_categories if code not in available_categories]

        if requested_categories and missing_categories:
            raise ValueError(
                "Requested categories are not present after filtering: "
                f"{', '.join(missing_categories)}"
            )

        if not categories:
            raise ValueError(
                "No requested activity category is available after filtering. "
                "Try another geo/sex/unit combination or enable --all-categories."
            )

    selected = selected[selected["activity_category"].isin(categories)].copy()
    return selected, years, categories, missing_categories, using_default_categories


def build_complete_grid(
    years: list[int],
    age_groups: list[str],
    categories: list[str],
) -> pd.DataFrame:
    return pd.DataFrame(
        [
            (year, age_group, category)
            for year in years
            for age_group in age_groups
            for category in categories
        ],
        columns=["year", "age_group", "activity_category"],
    )


def merge_with_complete_grid(
    grouped: pd.DataFrame,
    years: list[int],
    age_groups: list[str],
    categories: list[str],
) -> pd.DataFrame:
    complete_grid = build_complete_grid(years, age_groups, categories)
    merged = complete_grid.merge(
        grouped,
        on=["year", "age_group", "activity_category"],
        how="left",
    )
    merged["observation_count"] = merged["observation_count"].fillna(0).astype(int)
    return merged.sort_values(["year", "age_group", "activity_category"]).reset_index(drop=True)


def rounded_float(value: Any) -> float | None:
    if pd.isna(value):
        return None
    return round(float(value), 3)


def build_records(df: pd.DataFrame) -> list[dict[str, Any]]:
    records: list[dict[str, Any]] = []
    for row in df.itertuples(index=False):
        records.append(
            {
                "year": int(row.year),
                "age_group": str(row.age_group),
                "activity_category": str(row.activity_category),
                "average_minutes": rounded_float(row.average_minutes),
                "observation_count": int(row.observation_count),
            }
        )
    return records


def build_values_index(records: list[dict[str, Any]]) -> dict[str, dict[str, dict[str, dict[str, Any]]]]:
    values: dict[str, dict[str, dict[str, dict[str, Any]]]] = {}
    for record in records:
        year_key = str(record["year"])
        age_group = str(record["age_group"])
        category = str(record["activity_category"])
        values.setdefault(year_key, {}).setdefault(age_group, {})[category] = {
            "average_minutes": record["average_minutes"],
            "observation_count": record["observation_count"],
        }
    return values


def build_payload(
    args: argparse.Namespace,
    filtered: pd.DataFrame,
    extracted: pd.DataFrame,
    years: list[int],
    age_groups: list[str],
    categories: list[str],
    category_source: str,
    missing_default_categories: list[str],
    using_default_categories: bool,
) -> dict[str, Any]:
    records = build_records(extracted)
    return {
        "generated_at_utc": datetime.now(timezone.utc).isoformat(),
        "filters": {
            "geo": args.geo,
            "sex": args.sex,
            "unit": args.unit,
        },
        "dataset": {
            "repo_id": args.repo_id,
            "config": args.config,
            "split": args.split,
            "local_dataset_dir": str(args.local_dataset_dir) if args.local_dataset_dir else None,
            "activity_category_source": category_source,
        },
        "extraction": {
            "include_partial_categories": bool(args.include_partial_categories),
            "all_categories": bool(args.all_categories),
            "using_default_categories": using_default_categories,
            "missing_default_categories": missing_default_categories,
        },
        "years": years,
        "age_groups": age_groups,
        "age_group_source_codes": {
            age_group: list(AGE_GROUP_SOURCE_CODES[age_group])
            for age_group in age_groups
        },
        "activity_categories": categories,
        "summary": {
            "filtered_rows": int(len(filtered)),
            "aggregated_rows_with_data": int((extracted["observation_count"] > 0).sum()),
            "output_records": int(len(records)),
        },
        "records": records,
        "values": build_values_index(records),
    }


def save_payload(payload: dict[str, Any], output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", encoding="utf-8") as handle:
        json.dump(payload, handle, ensure_ascii=False, indent=2)


def main() -> None:
    args = parse_args()
    df = load_observations(args)
    validate_required_columns(df)

    filtered, category_source = prepare_filtered_data(df, args)
    if filtered.empty:
        raise ValueError(
            "No rows left after filtering. Try another geo/sex/unit combination, "
            "or use a local harmonized dataset."
        )

    grouped = aggregate_minutes(filtered)
    grouped, years, categories, missing_default_categories, using_default_categories = select_categories(
        grouped,
        args,
    )

    age_groups = [
        age_group
        for age_group in AGE_GROUP_ORDER
        if age_group in set(grouped["age_group"].astype(str).tolist())
    ]
    extracted = merge_with_complete_grid(grouped, years, age_groups, categories)

    payload = build_payload(
        args=args,
        filtered=filtered,
        extracted=extracted,
        years=years,
        age_groups=age_groups,
        categories=categories,
        category_source=category_source,
        missing_default_categories=missing_default_categories,
        using_default_categories=using_default_categories,
    )
    save_payload(payload, args.output_json)

    if missing_default_categories and using_default_categories:
        print(
            "Warning: skipped default categories missing after filtering: "
            f"{', '.join(missing_default_categories)}"
        )

    print(f"Saved JSON extraction: {args.output_json.resolve()}")
    print(f"Category source: {category_source}")
    print(f"Years included: {years}")
    print(f"Age groups included: {age_groups}")
    print(f"Categories extracted: {categories}")
    print(f"Rows used after filtering: {len(filtered)}")


if __name__ == "__main__":
    main()
