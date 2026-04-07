from __future__ import annotations

import argparse
import os
import re
from pathlib import Path
from typing import Iterable, cast

import matplotlib.pyplot as plt
import pandas as pd
import yaml
from datasets import Dataset, load_dataset, load_from_disk


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Plot a few unified ACL18 activity categories from the HETUS dataset, "
            "using the ACL18 YAML file for human-readable descriptions."
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
        help="Dataset config to load (default: observations)",
    )
    parser.add_argument(
        "--split",
        type=str,
        default="train",
        help="Dataset split to load (default: train)",
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
        default=Path("hf_export") / "hf_dataset_unified_acl",
        help=(
            "Optional local dataset path containing unified_acl_codes. "
            "If the dataset exists and contains unified_acl_codes it is used; "
            "otherwise the script falls back to the remote dataset."
        ),
    )
    parser.add_argument(
        "--yml-file",
        type=Path,
        default=Path("mappings") / "activities_ACL18.yml",
        help="ACL18 YAML file containing category codes and descriptions.",
    )
    parser.add_argument(
        "--categories",
        type=str,
        default="",
        help=(
            "Comma-separated list of unified ACL18 codes to plot. "
            "If omitted, top categories by mean minutes are selected."
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
        help="Unit filter (default: TIME_SP).",
    )
    parser.add_argument(
        "--max-categories",
        type=int,
        default=4,
        help="Maximum number of categories to plot when --categories is omitted.",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("hf_export") / "unified_acl_categories.png",
        help="Output PNG path.",
    )
    return parser.parse_args()


def load_category_labels(yml_file: Path) -> dict[str, str]:
    if not yml_file.exists():
        raise FileNotFoundError(f"ACL18 YAML file not found: {yml_file}")

    with yml_file.open("r", encoding="utf-8") as handle:
        content = yaml.safe_load(handle)

    codes = content.get("codes", {}) if isinstance(content, dict) else {}
    labels: dict[str, str] = {}
    for code, entry in codes.items():
        if not isinstance(entry, dict):
            continue
        name = entry.get("name", {})
        if isinstance(name, dict):
            label = name.get("en") or name.get("en_US") or next(iter(name.values()), None)
        else:
            label = str(name) if name is not None else None

        labels[code] = str(label).strip() if label else code

    return labels


def load_local_unified_dataset(args: argparse.Namespace) -> Dataset | None:
    if not args.local_dataset_dir or not args.local_dataset_dir.exists():
        return None

    try:
        local_data = load_from_disk(str(args.local_dataset_dir))
    except Exception as exc:
        print(
            f"Warning: could not load local dataset at {args.local_dataset_dir}: {exc}"
        )
        return None

    if isinstance(local_data, Dataset):
        local_dataset = local_data
    else:
        if args.config not in local_data:
            available = ", ".join(str(key) for key in local_data.keys())
            raise KeyError(
                f"Config '{args.config}' not found in local dataset. Available: {available}"
            )
        local_dataset = local_data[args.config]

    if "unified_acl_codes" in local_dataset.column_names:
        return local_dataset

    print(
        f"Local dataset at {args.local_dataset_dir} was loaded but does not "
        "contain unified_acl_codes. Falling back to remote dataset."
    )
    return None


def load_observations(args: argparse.Namespace) -> pd.DataFrame:
    token = os.environ.get(args.token_env, "").strip() or None
    local_dataset = load_local_unified_dataset(args)
    if local_dataset is not None:
        return cast(pd.DataFrame, local_dataset.to_pandas())

    dataset = load_dataset(args.repo_id, args.config, split=args.split, token=token)
    return cast(pd.DataFrame, dataset.to_pandas())


def age_sort_key(age_label: str) -> tuple[int, int, str]:
    if age_label == "TOTAL":
        return (-1, -1, age_label)

    between = re.match(r"^Y(\d+)-(\d+)$", age_label)
    if between:
        return (0, int(between.group(1)), age_label)

    ge = re.match(r"^Y_GE(\d+)$", age_label)
    if ge:
        return (1, int(ge.group(1)), age_label)

    lt = re.match(r"^Y_LT(\d+)$", age_label)
    if lt:
        return (0, -1, age_label)

    return (2, 999, age_label)


def ordered_age_groups(values: Iterable[str]) -> list[str]:
    unique = sorted({v for v in values if isinstance(v, str) and v.strip()}, key=age_sort_key)
    return unique


def select_categories(df: pd.DataFrame, categories: list[str], max_categories: int) -> list[str]:
    if categories:
        return categories

    grouped = df.groupby("activity_category", as_index=False)["minutes"].mean()
    grouped = cast(pd.DataFrame, grouped).sort_values(by="minutes", ascending=False)
    top = grouped.head(max_categories)["activity_category"].astype(str).tolist()
    return top


def main() -> None:
    args = parse_args()
    labels = load_category_labels(args.yml_file)
    df = load_observations(args)

    if "unified_acl_codes" not in df.columns:
        raise ValueError(
            "Dataset must contain unified_acl_codes. "
            "Please run add_unified_acl18_column.py and provide a dataset with unified_acl_codes."
        )

    df["activity_category"] = df["unified_acl_codes"].astype(str).str.strip()

    df["minutes"] = pd.to_numeric(df["duration_minutes"], errors="coerce")
    filtered = df[
        (df["unit"] == args.unit)
        & (df["geo"] == args.geo)
        & (df["sex"] == args.sex)
        & df["age"].notna()
        & (df["age"] != "")
        & (df["age"] != "TOTAL")
        & df["activity_category"].notna()
        & (df["activity_category"] != "")
        & (df["activity_category"] != "TOTAL")
        & df["minutes"].notna()
    ].copy()

    filtered["year"] = pd.to_numeric(filtered["time_period"], errors="coerce")
    filtered = filtered[filtered["year"].notna()].copy()
    filtered["year"] = filtered["year"].astype(int)

    if filtered.empty:
        raise ValueError(
            "No rows left after filtering. Try another geo/sex/unit, "
            "or use --local-dataset-dir for local exploration."
        )

    requested_categories = [c.strip() for c in args.categories.split(",") if c.strip()]
    categories_to_plot = select_categories(filtered, requested_categories, args.max_categories)

    missing_categories = [c for c in categories_to_plot if c not in filtered["activity_category"].unique()]
    if missing_categories:
        raise ValueError(
            f"Requested category codes not present in filtered data: {', '.join(missing_categories)}"
        )

    plot_df = filtered[filtered["activity_category"].isin(categories_to_plot)].copy()
    years = sorted(plot_df["year"].unique().tolist())

    n = len(categories_to_plot)
    fig, axes = plt.subplots(n, 1, figsize=(11, 2.7 * n), sharex=True)
    if n == 1:
        axes = [axes]

    for ax, category in zip(axes, categories_to_plot):
        cat_df = plot_df[plot_df["activity_category"] == category].copy()
        ages = ordered_age_groups(cat_df["age"].tolist())
        label = labels.get(category, category)

        for year in years:
            ydf = cat_df[cat_df["year"] == year]
            ymap = dict(zip(ydf["age"], ydf["minutes"]))
            yvals = [ymap.get(a, float("nan")) for a in ages]
            ax.plot(ages, yvals, marker="o", linewidth=1.5, label=str(year))

        ax.set_title(f"{category}: {label}")
        ax.set_ylabel("Minutes")
        ax.grid(True, axis="y", alpha=0.25)

    axes[-1].set_xlabel("Age group")
    for tick in axes[-1].get_xticklabels():
        tick.set_rotation(45)
        tick.set_ha("right")

    handles, labels_ = axes[0].get_legend_handles_labels()
    fig.legend(handles, labels_, title="Year", loc="upper right")
    fig.suptitle(
        f"Average time spent by age group and category\n"
        f"geo={args.geo}, sex={args.sex}, unit={args.unit}",
        y=1.02,
    )

    args.output.parent.mkdir(parents=True, exist_ok=True)
    fig.tight_layout()
    fig.savefig(args.output, dpi=140, bbox_inches="tight")

    print(f"Saved plot: {args.output.resolve()}")
    print(f"Categories plotted: {', '.join(categories_to_plot)}")
    print(f"Years included: {years}")
    print(f"Rows used: {len(plot_df)}")


if __name__ == "__main__":
    main()
