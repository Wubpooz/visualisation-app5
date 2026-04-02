from __future__ import annotations

import argparse
import os
import re
from pathlib import Path
from typing import Iterable, cast

import matplotlib.pyplot as plt
import pandas as pd
from datasets import load_dataset, load_from_disk


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Plot average time spent (minutes) by age group and activity category, "
            "for each available year, from the HETUS HF dataset."
        )
    )
    parser.add_argument(
        "--repo-id",
        type=str,
        default=os.environ.get("HF_DATASET_REPO", "Wupbooz/hetus-time-use"),
        help="HF dataset repository id (default: env HF_DATASET_REPO or Wupbooz/hetus-time-use)",
    )
    parser.add_argument(
        "--config",
        type=str,
        default="observations",
        help="HF dataset config to load (default: observations)",
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
        default=None,
        help="Optional local dataset path created by save_to_disk (e.g. hf_export/hf_dataset).",
    )
    parser.add_argument(
        "--geo",
        type=str,
        default="DE",
        help="Geography filter (default: DE, has 2000/2010/2020 coverage in this dataset).",
    )
    parser.add_argument(
        "--sex",
        type=str,
        default="T",
        help="Sex filter (default: T, total).",
    )
    parser.add_argument(
        "--unit",
        type=str,
        default="TIME_SP",
        help="Unit filter (default: TIME_SP, time spent).",
    )
    parser.add_argument(
        "--max-categories",
        type=int,
        default=4,
        help="Number of top categories to plot (default: 4).",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("hf_export") / "age_category_by_year.png",
        help="Output PNG path.",
    )
    return parser.parse_args()


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


def load_observations(args: argparse.Namespace) -> pd.DataFrame:
    token = os.environ.get(args.token_env, "").strip() or None

    if args.local_dataset_dir is not None:
        dataset = load_from_disk(str(args.local_dataset_dir))[args.config]
    else:
        dataset = load_dataset(args.repo_id, args.config, split=args.split, token=token)

    return cast(pd.DataFrame, dataset.to_pandas())


def main() -> None:
    args = parse_args()
    df = load_observations(args)

    # Harmonize category key across waves.
    df["activity_category"] = df["acl00"].where(df["acl00"].notna() & (df["acl00"] != ""), df["acl18"])

    # Keep rows that can represent time spent in minutes.
    df["minutes"] = pd.to_numeric(df["duration_minutes"], errors="coerce")
    filtered = df[
        (df["unit"] == args.unit)
        & (df["geo"] == args.geo)
        & (df["sex"] == args.sex)
        & (df["age"].notna())
        & (df["age"] != "")
        & (df["age"] != "TOTAL")
        & (df["activity_category"].notna())
        & (df["activity_category"] != "")
        & (df["activity_category"] != "TOTAL")
        & (df["minutes"].notna())
    ].copy()

    filtered["year"] = pd.to_numeric(filtered["time_period"], errors="coerce")
    filtered = filtered[filtered["year"].notna()].copy()
    filtered["year"] = filtered["year"].astype(int)

    if filtered.empty:
        raise ValueError(
            "No rows left after filtering. Try another geo/sex/unit, "
            "or use --local-dataset-dir for local exploration."
        )

    grouped = (
        filtered.groupby(["year", "age", "activity_category"], as_index=False)["minutes"]
        .mean()
        .sort_values(["activity_category", "year", "age"])
    )

    all_years = sorted(grouped["year"].unique().tolist())
    year_count = len(all_years)

    # Keep categories that have values for every available year.
    category_year_coverage = grouped.groupby("activity_category")["year"].nunique()
    eligible_categories = category_year_coverage[category_year_coverage == year_count].index.tolist()
    if not eligible_categories:
        raise ValueError(
            "No category has coverage for all available years after filtering. "
            "Try another --geo / --sex / --unit combination."
        )

    grouped = grouped[grouped["activity_category"].isin(eligible_categories)].copy()

    top_categories = (
        grouped.groupby("activity_category", as_index=False)["minutes"]
        .mean()
        .sort_values("minutes", ascending=False)
        .head(max(args.max_categories, 1))["activity_category"]
        .tolist()
    )

    plot_df = grouped[grouped["activity_category"].isin(top_categories)].copy()
    years = sorted(plot_df["year"].unique().tolist())

    n = len(top_categories)
    fig, axes = plt.subplots(n, 1, figsize=(11, 2.7 * n), sharex=True)
    if n == 1:
        axes = [axes]

    for ax, category in zip(axes, top_categories):
        cat_df = plot_df[plot_df["activity_category"] == category].copy()
        ages = ordered_age_groups(cat_df["age"].tolist())

        for year in years:
            ydf = cat_df[cat_df["year"] == year]
            ymap = dict(zip(ydf["age"], ydf["minutes"]))
            yvals = [ymap.get(a, float("nan")) for a in ages]
            ax.plot(ages, yvals, marker="o", linewidth=1.5, label=str(year))

        ax.set_title(f"Category {category}")
        ax.set_ylabel("Minutes")
        ax.grid(True, axis="y", alpha=0.25)

    axes[-1].set_xlabel("Age group")
    for tick in axes[-1].get_xticklabels():
        tick.set_rotation(45)
        tick.set_ha("right")

    handles, labels = axes[0].get_legend_handles_labels()
    fig.legend(handles, labels, title="Year", loc="upper right")
    fig.suptitle(
        f"Average time spent by age group and category\n"
        f"geo={args.geo}, sex={args.sex}, unit={args.unit}",
        y=1.02,
    )

    args.output.parent.mkdir(parents=True, exist_ok=True)
    fig.tight_layout()
    fig.savefig(args.output, dpi=140, bbox_inches="tight")

    print(f"Saved plot: {args.output.resolve()}")
    print(f"Years included: {years}")
    print(f"Rows used: {len(filtered)} | Categories plotted: {top_categories}")


if __name__ == "__main__":
    main()
