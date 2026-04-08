from __future__ import annotations

import argparse
import json
import os
from datetime import datetime, timezone
from math import floor
from pathlib import Path
from typing import Any, cast

import pandas as pd
import pyarrow.parquet as pq
from datasets import Dataset, DatasetDict, load_dataset_builder, load_from_disk
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

ACTIVITY_CATEGORY_GROUPS: dict[str, tuple[str, ...]] = {
    "AC02 + AC021": ("AC02", "AC021"),
}

ACTIVITY_CATEGORY_ALIASES = {
    source_code: category
    for category, source_codes in ACTIVITY_CATEGORY_GROUPS.items()
    for source_code in source_codes
}

DEFAULT_ACTIVITY_CATEGORIES = [
    "AC01",
    "AC02 + AC021",
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

SOCIAL_CONTEXT_ORDER = ["shared", "alone", "other"]
DATASET_CONFIG_ALIASES = {
    "observation": "observations",
}
REMOTE_BATCH_COLUMNS = [
    "duration_minutes",
    "age",
    "geo",
    "sex",
    "unit",
    "freq",
    "time_period_year",
    "time_period",
    "unified_acl_codes",
    "acl18",
    "acl00",
]
FILTER_DIAGNOSTIC_KEYS = [
    "source_rows",
    "after_geo",
    "after_sex",
    "after_unit",
    "after_freq",
    "after_age_group",
    "after_activity_category",
    "after_minutes_year",
]
UNFILTERED_DIMENSION_TOKENS = {"", "*", "ALL"}


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
        help=(
            "Dataset config to load (default: observations; the alias 'observation' "
            "is normalized to 'observations')."
        ),
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
        "--batch-size",
        type=int,
        default=100_000,
        help=(
            "Rows per parquet batch when scanning a remote HF split incrementally "
            "(default: 100000)."
        ),
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
        default="ALL",
        help=(
            "Geography filter. Use a code like DE, a comma-separated list like DE,FR, "
            "or ALL/* for no geo filter (default: ALL)."
        ),
    )
    parser.add_argument(
        "--sex",
        type=str,
        default="ALL",
        help=(
            "Sex filter. Use a code like T, a comma-separated list like T,F, "
            "or ALL/* for no sex filter (default: ALL)."
        ),
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
    parser.add_argument(
        "--social-context-markdown",
        type=Path,
        default=Path("docs") / "observations-count-by-unified-acl-codes.md",
        help=(
            "Markdown file listing unified ACL codes with their alone/shared/other/none "
            "classification."
        ),
    )
    return parser.parse_args()


def normalize_text(value: Any) -> str:
    if value is None or pd.isna(value):
        return ""

    text = str(value).strip()
    return "" if text.lower() == "nan" else text


def normalize_activity_category(value: Any) -> str:
    code = normalize_text(value)
    if code == "":
        return ""
    return ACTIVITY_CATEGORY_ALIASES.get(code, code)


def unique_preserving_order(values: list[str]) -> list[str]:
    return list(dict.fromkeys(values))


def parse_dimension_filter(raw_value: str) -> set[str] | None:
    normalized_values = unique_preserving_order(
        [normalize_text(part) for part in raw_value.split(",") if normalize_text(part)]
    )
    if not normalized_values:
        return None
    if any(value.upper() in UNFILTERED_DIMENSION_TOKENS for value in normalized_values):
        return None
    return set(normalized_values)


def canonicalize_config_name(config_name: str) -> str:
    raw_config = config_name.strip()
    return DATASET_CONFIG_ALIASES.get(raw_config.lower(), raw_config)


def empty_filter_diagnostics() -> dict[str, int]:
    return {key: 0 for key in FILTER_DIAGNOSTIC_KEYS}


def merge_filter_diagnostics(
    total: dict[str, int],
    current: dict[str, int],
) -> None:
    for key in FILTER_DIAGNOSTIC_KEYS:
        total[key] += int(current.get(key, 0))


def load_local_observations(args: argparse.Namespace) -> pd.DataFrame:
    if not args.local_dataset_dir or not args.local_dataset_dir.exists():
        raise FileNotFoundError(f"Local dataset not found: {args.local_dataset_dir}")

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

    raise FileNotFoundError(f"Local dataset not found: {args.local_dataset_dir}")


def resolve_remote_split_row_count(
    args: argparse.Namespace,
    token: str | None,
) -> int | None:
    builder = load_dataset_builder(args.repo_id, args.config, token=token)
    if args.split not in builder.info.splits:
        available = ", ".join(sorted(builder.info.splits))
        raise KeyError(
            f"Split '{args.split}' not found in dataset config '{args.config}'. "
            f"Available splits: {available}"
        )

    split_info = builder.info.splits[args.split]
    return int(split_info.num_examples) if split_info.num_examples is not None else None


def list_remote_parquet_files(
    args: argparse.Namespace,
    token: str | None,
) -> list[str]:
    repo_files = list_repo_files(args.repo_id, repo_type="dataset", token=token)
    parquet_files = sorted(
        path
        for path in repo_files
        if path.startswith(f"{args.config}/")
        and Path(path).name.startswith(f"{args.split}-")
        and path.endswith(".parquet")
    )
    if parquet_files:
        return parquet_files

    available_configs = sorted(
        {
            Path(path).parts[0]
            for path in repo_files
            if path.endswith(".parquet") and len(Path(path).parts) > 1
        }
    )
    available_config_text = ", ".join(available_configs) if available_configs else "none"
    raise FileNotFoundError(
        "No parquet shard found for the requested dataset config/split: "
        f"config={args.config} split={args.split}. Available configs: {available_config_text}"
    )


def aggregate_remote_observations(
    args: argparse.Namespace,
    token: str | None,
) -> tuple[pd.DataFrame, str, dict[str, int]]:
    expected_source_rows = resolve_remote_split_row_count(args, token)
    parquet_files = list_remote_parquet_files(args, token)
    summaries: list[pd.DataFrame] = []
    diagnostics = empty_filter_diagnostics()
    category_source = "derived_from_acl00_acl18"
    validated_batch = False

    for parquet_file in parquet_files:
        local_path = hf_hub_download(
            repo_id=args.repo_id,
            filename=parquet_file,
            repo_type="dataset",
            token=token,
        )
        parquet_reader = pq.ParquetFile(local_path)
        batch_columns = [
            column_name
            for column_name in REMOTE_BATCH_COLUMNS
            if column_name in parquet_reader.schema_arrow.names
        ]

        for batch in parquet_reader.iter_batches(columns=batch_columns, batch_size=args.batch_size):
            batch_df = batch.to_pandas()
            if not validated_batch:
                validate_required_columns(batch_df)
                validated_batch = True

            filtered_batch, batch_category_source, batch_diagnostics = prepare_filtered_data(
                batch_df,
                args,
            )
            merge_filter_diagnostics(diagnostics, batch_diagnostics)
            if batch_category_source == "unified_acl_codes":
                category_source = batch_category_source
            if not filtered_batch.empty:
                summaries.append(summarize_minutes(filtered_batch))

    if not validated_batch:
        raise ValueError("No parquet batch could be read for the requested dataset config/split.")

    if expected_source_rows is not None and diagnostics["source_rows"] != expected_source_rows:
        raise ValueError(
            "The incremental parquet scan did not cover the full requested split. "
            f"Expected {expected_source_rows} rows, scanned {diagnostics['source_rows']}."
        )

    return combine_aggregated_minutes(summaries), category_source, diagnostics


def extract_observations(
    args: argparse.Namespace,
) -> tuple[pd.DataFrame, str, dict[str, int], str]:
    token = os.environ.get(args.token_env, "").strip() or None

    if args.local_dataset_dir and args.local_dataset_dir.exists():
        df = load_local_observations(args)
        validate_required_columns(df)
        filtered, category_source, diagnostics = prepare_filtered_data(df, args)
        return aggregate_minutes(filtered), category_source, diagnostics, "local_save_to_disk"

    grouped, category_source, diagnostics = aggregate_remote_observations(args, token)
    return grouped, category_source, diagnostics, "remote_parquet_batches"


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
) -> tuple[pd.DataFrame, str, dict[str, int]]:
    working = df.copy()
    activity_categories, category_source = build_activity_categories(working)

    working["activity_category"] = activity_categories.map(normalize_activity_category)
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

    geo_filters = parse_dimension_filter(args.geo)
    sex_filters = parse_dimension_filter(args.sex)

    if geo_filters is None:
        geo_mask = pd.Series(True, index=working.index)
    else:
        geo_mask = working["geo_norm"].isin(geo_filters)

    if sex_filters is None:
        sex_mask = geo_mask
    else:
        sex_mask = geo_mask & working["sex_norm"].isin(sex_filters)

    unit_mask = sex_mask & (working["unit_norm"] == args.unit)
    freq_mask = unit_mask & (working["freq_norm"].isin(["", "A"]))
    age_group_mask = freq_mask & (working["age_group"] != "")
    activity_category_mask = (
        age_group_mask
        & (working["activity_category"] != "")
        & (working["activity_category"] != "TOTAL")
    )
    final_mask = activity_category_mask & working["minutes"].notna() & working["year"].notna()

    filtered = working[final_mask][["year", "age_group", "activity_category", "minutes", "age_raw"]].copy()
    filter_diagnostics = {
        "source_rows": int(len(working)),
        "after_geo": int(geo_mask.sum()),
        "after_sex": int(sex_mask.sum()),
        "after_unit": int(unit_mask.sum()),
        "after_freq": int(freq_mask.sum()),
        "after_age_group": int(age_group_mask.sum()),
        "after_activity_category": int(activity_category_mask.sum()),
        "after_minutes_year": int(final_mask.sum()),
    }

    filtered["year"] = filtered["year"].astype(int)
    return filtered, category_source, filter_diagnostics


def summarize_minutes(filtered: pd.DataFrame) -> pd.DataFrame:
    grouped = (
        filtered.groupby(["year", "age_group", "activity_category"], as_index=False)
        .agg(
            total_minutes=("minutes", "sum"),
            observation_count=("minutes", "size"),
        )
    )
    return grouped


def combine_aggregated_minutes(summaries: list[pd.DataFrame]) -> pd.DataFrame:
    if not summaries:
        return pd.DataFrame(
            columns=[
                "year",
                "age_group",
                "activity_category",
                "average_minutes",
                "observation_count",
                "total_minutes",
            ]
        )

    combined = pd.concat(summaries, ignore_index=True)
    grouped = (
        combined.groupby(["year", "age_group", "activity_category"], as_index=False)
        .agg(
            total_minutes=("total_minutes", "sum"),
            observation_count=("observation_count", "sum"),
        )
        .sort_values(["year", "age_group", "activity_category"])
        .reset_index(drop=True)
    )
    grouped["average_minutes"] = grouped["total_minutes"] / grouped["observation_count"]
    return grouped[
        [
            "year",
            "age_group",
            "activity_category",
            "average_minutes",
            "observation_count",
            "total_minutes",
        ]
    ]


def aggregate_minutes(filtered: pd.DataFrame) -> pd.DataFrame:
    return combine_aggregated_minutes([summarize_minutes(filtered)])


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
    requested_categories = unique_preserving_order(
        [
            normalize_activity_category(code)
            for code in args.categories.split(",")
            if code.strip()
        ]
    )
    using_default_categories = not args.all_categories and not requested_categories

    if args.all_categories:
        categories = sorted(available_categories)
        missing_categories: list[str] = []
    else:
        desired_categories = unique_preserving_order(requested_categories or DEFAULT_ACTIVITY_CATEGORIES)
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
    if "total_minutes" in merged.columns:
        merged["total_minutes"] = merged["total_minutes"].fillna(0.0)
    return merged.sort_values(["year", "age_group", "activity_category"]).reset_index(drop=True)


def rounded_float(value: Any) -> float | None:
    if pd.isna(value):
        return None
    return round(float(value), 3)


def load_social_context_map(markdown_path: Path) -> dict[str, str]:
    if not markdown_path.exists():
        raise FileNotFoundError(f"Social context markdown file not found: {markdown_path}")

    social_context_map: dict[str, str] = {}
    for raw_line in markdown_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line.startswith("|"):
            continue
        if "unified_acl_codes" in line or "---" in line:
            continue

        parts = [part.strip() for part in line.strip("|").split("|")]
        if len(parts) < 4:
            continue

        code = parts[1].strip()
        social_context = parts[3].strip().lower()
        if code == "(blank)" or social_context == "none":
            continue
        if social_context not in SOCIAL_CONTEXT_ORDER:
            continue

        social_context_map[code] = social_context

    if not social_context_map:
        raise ValueError(
            f"No alone/shared/other activity mapping could be parsed from {markdown_path}"
        )

    return social_context_map


def allocate_percentage_units(context_minutes: dict[str, float]) -> dict[str, float]:
    total_minutes = sum(context_minutes.values())
    if total_minutes <= 0:
        raise ValueError("Cannot compute social context percentages from a zero total.")

    target_units = 100_000
    raw_units = {
        context: context_minutes[context] * target_units / total_minutes
        for context in SOCIAL_CONTEXT_ORDER
    }
    base_units = {context: int(floor(raw_units[context])) for context in SOCIAL_CONTEXT_ORDER}
    remainder_units = target_units - sum(base_units.values())
    ranked_contexts = sorted(
        SOCIAL_CONTEXT_ORDER,
        key=lambda context: (raw_units[context] - base_units[context], context_minutes[context]),
        reverse=True,
    )
    for index in range(remainder_units):
        base_units[ranked_contexts[index % len(ranked_contexts)]] += 1

    return {
        context: base_units[context] / 1000.0
        for context in SOCIAL_CONTEXT_ORDER
    }


def compute_social_context_percentages(
    grouped: pd.DataFrame,
    years: list[int],
    age_groups: list[str],
    social_context_map: dict[str, str],
) -> dict[tuple[int, str], dict[str, float]]:
    social_df = grouped[grouped["activity_category"].isin(social_context_map)].copy()
    if social_df.empty:
        raise ValueError("No activity category from the social context markdown is present in the filtered data.")

    social_df["social_context"] = social_df["activity_category"].map(social_context_map)
    social_totals = (
        social_df.groupby(["year", "age_group", "social_context"], as_index=False)["average_minutes"]
        .sum()
        .sort_values(["year", "age_group", "social_context"])
    )
    totals_lookup = {
        (int(row.year), str(row.age_group), str(row.social_context)): float(row.average_minutes)
        for row in social_totals.itertuples(index=False)
    }

    percentages: dict[tuple[int, str], dict[str, float]] = {}
    for year in years:
        for age_group in age_groups:
            minutes_by_context = {
                context: totals_lookup.get((year, age_group, context), 0.0)
                for context in SOCIAL_CONTEXT_ORDER
            }
            percentages[(year, age_group)] = allocate_percentage_units(minutes_by_context)

    return percentages


def build_values_index(
    extracted: pd.DataFrame,
    social_percentages: dict[tuple[int, str], dict[str, float]],
) -> dict[str, dict[str, dict[str, Any]]]:
    values: dict[str, dict[str, dict[str, Any]]] = {}
    grouped_nodes = extracted.groupby(["year", "age_group"], sort=True)

    for (year, age_group), node_df in grouped_nodes:
        year_key = str(int(year))
        age_key = str(age_group)
        pct = social_percentages[(int(year), age_key)]
        node: dict[str, Any] = {
            "shared_pct": pct["shared"],
            "alone_pct": pct["alone"],
            "other_pct": pct["other"],
        }

        for row in node_df.itertuples(index=False):
            node[str(row.activity_category)] = {
                "average_minutes": rounded_float(row.average_minutes),
                "observation_count": int(row.observation_count),
            }

        values.setdefault(year_key, {})[age_key] = node

    return values


def validate_social_context_sums(values: dict[str, dict[str, dict[str, Any]]]) -> None:
    for year, year_values in values.items():
        for age_group, node in year_values.items():
            pct_sum = round(
                float(node["shared_pct"]) + float(node["alone_pct"]) + float(node["other_pct"]),
                3,
            )
            if pct_sum != 100.0:
                raise ValueError(
                    "Social context percentages must sum to 100. "
                    f"Got {pct_sum} for year={year}, age_group={age_group}."
                )


def build_payload(
    args: argparse.Namespace,
    filtered_row_count: int,
    extracted: pd.DataFrame,
    years: list[int],
    age_groups: list[str],
    categories: list[str],
    category_source: str,
    missing_default_categories: list[str],
    using_default_categories: bool,
    social_percentages: dict[tuple[int, str], dict[str, float]],
    filter_diagnostics: dict[str, int],
    load_mode: str,
) -> dict[str, Any]:
    values = build_values_index(extracted, social_percentages)
    validate_social_context_sums(values)

    return {
        "generated_at_utc": datetime.now(timezone.utc).isoformat(),
        "dataset": {
            "repo_id": args.repo_id,
            "config": args.config,
            "split": args.split,
            "local_dataset_dir": (
                str(args.local_dataset_dir)
                if args.local_dataset_dir and args.local_dataset_dir.exists()
                else None
            ),
            "load_mode": load_mode,
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
            "source_rows": int(filter_diagnostics["source_rows"]),
            "filtered_rows": int(filtered_row_count),
            "aggregated_rows_with_data": int((extracted["observation_count"] > 0).sum()),
            "output_records": int(len(extracted)),
            "filter_diagnostics": {
                key: int(filter_diagnostics[key])
                for key in FILTER_DIAGNOSTIC_KEYS
                if key != "source_rows"
            },
        },
        "values": values,
    }


def save_payload(payload: dict[str, Any], output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", encoding="utf-8") as handle:
        json.dump(payload, handle, ensure_ascii=False, indent=2)


def main() -> None:
    args = parse_args()
    args.config = canonicalize_config_name(args.config)

    grouped_all, category_source, filter_diagnostics, load_mode = extract_observations(args)
    filtered_row_count = int(filter_diagnostics["after_minutes_year"])
    if filtered_row_count == 0:
        raise ValueError(
            "No rows left after filtering. Try another geo/sex/unit combination, "
            "or use a local harmonized dataset."
        )

    social_context_map = load_social_context_map(args.social_context_markdown)
    grouped, years, categories, missing_default_categories, using_default_categories = select_categories(
        grouped_all,
        args,
    )

    age_groups = [
        age_group
        for age_group in AGE_GROUP_ORDER
        if age_group in set(grouped["age_group"].astype(str).tolist())
    ]
    extracted = merge_with_complete_grid(grouped, years, age_groups, categories)
    social_percentages = compute_social_context_percentages(
        grouped=grouped_all,
        years=years,
        age_groups=age_groups,
        social_context_map=social_context_map,
    )

    payload = build_payload(
        args=args,
        filtered_row_count=filtered_row_count,
        extracted=extracted,
        years=years,
        age_groups=age_groups,
        categories=categories,
        category_source=category_source,
        missing_default_categories=missing_default_categories,
        using_default_categories=using_default_categories,
        social_percentages=social_percentages,
        filter_diagnostics=filter_diagnostics,
        load_mode=load_mode,
    )
    save_payload(payload, args.output_json)

    if missing_default_categories and using_default_categories:
        print(
            "Warning: skipped default categories missing after filtering: "
            f"{', '.join(missing_default_categories)}"
        )

    print(f"Saved JSON extraction: {args.output_json.resolve()}")
    print(f"Load mode: {load_mode}")
    print(f"Category source: {category_source}")
    print(f"Years included: {years}")
    print(f"Age groups included: {age_groups}")
    print(f"Categories extracted: {categories}")
    print(
        "Filter diagnostics: "
        + ", ".join(f"{key}={filter_diagnostics[key]}" for key in FILTER_DIAGNOSTIC_KEYS)
    )
    print(f"Rows used after filtering: {filtered_row_count}")


if __name__ == "__main__":
    main()
