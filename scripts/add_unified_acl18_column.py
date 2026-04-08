from __future__ import annotations

import argparse
import os
from pathlib import Path
from typing import Any, cast

import pandas as pd
from datasets import Dataset, DatasetDict, load_dataset, load_from_disk


def parse_args() -> argparse.Namespace:
    script_root = Path(__file__).resolve().parent
    parser = argparse.ArgumentParser(
        description=(
            "Add a unified ACL18 column (`unified_acl_codes`) to HETUS observations. "
            "Rows keep `acl18` when present; otherwise `acl00` is mapped via the "
            "embedded Python ACL00→ACL18 mapping object."
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
        help="Environment variable that stores the Hugging Face token.",
    )
    parser.add_argument(
        "--local-dataset-dir",
        type=Path,
        default=script_root.parent / "hf_export" / "hf_dataset",
        help=(
            "Optional local DatasetDict path created by save_to_disk. "
            "If it exists and contains --config, it is used instead of Hub download."
        ),
    )
    parser.add_argument(
        "--column-name",
        type=str,
        default="unified_acl_codes",
        help="Name of the column to create (default: unified_acl_codes).",
    )
    parser.add_argument(
        "--max-rows",
        type=int,
        default=0,
        help=(
            "If > 0, process only the first N rows for a small local smoke run "
            "(no implicit push)."
        ),
    )
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=script_root.parent / "hf_export" / "hf_dataset_unified_acl",
        help="Directory where the updated dataset is saved locally (default: hf_export/hf_dataset_unified_acl).",
    )
    parser.add_argument(
        "--push-to-hub",
        action="store_true",
        help="Push updated data to Hugging Face Hub.",
    )
    parser.add_argument(
        "--target-repo-id",
        type=str,
        default="",
        help="Target HF repo for push (defaults to --repo-id).",
    )
    parser.add_argument(
        "--target-config",
        type=str,
        default="",
        help="Target config for push (defaults to --config).",
    )
    parser.add_argument(
        "--target-split",
        type=str,
        default="",
        help="Target split for push (defaults to --split).",
    )
    parser.add_argument(
        "--private",
        action="store_true",
        help="Push as private dataset/config when used with --push-to-hub.",
    )
    return parser.parse_args()


def load_local_env(dotenv_path: Path) -> None:
    if not dotenv_path.exists():
        return

    for raw_line in dotenv_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        if key and key not in os.environ:
            os.environ[key] = value


ACL00_TO_ACL18_MAPPING: dict[str, str] = {
    'AC0A': 'AC0_X_021',
    'AC000': 'AC039',
    'AC010': 'AC11',
    'AC030': 'AC039',
    'AC1A': 'AC111',
    'AC1B': 'AC12',
    'AC100': 'AC1',
    'AC11': 'AC11',
    'AC111': 'AC111',
    'AC112': 'AC121',
    'AC12': 'AC11',
    'AC121': 'AC111',
    'AC122': 'AC121',
    'AC13': 'AC12',
    'AC130': 'AC129',
    'AC131': 'AC121',
    'AC139': 'AC129',
    'AC1_2_TR': 'AC1_2',
    'AC1_TR': 'AC11-12',
    'AC21A': 'AC21_X_212',
    'AC22': 'AC22',
    'AC200': 'AC219',
    'AC210': 'AC219',
    'AC310': 'AC31',
    'AC312': 'AC311',
    'AC313': 'AC312',
    'AC314': 'AC313',
    'AC319': 'AC31',
    'AC31A': 'AC31_X_312',
    'AC320': 'AC329',
    'AC32A': 'AC32_X_321',
    'AC330': 'AC33',
    'AC333': 'AC713',
    'AC33A': 'AC33',
    'AC34A': 'AC341_349',
    'AC340': 'AC349',
    'AC331': 'AC331',
    'AC332': 'AC332',
    'AC342': 'AC342',
    'AC343': 'AC343',
    'AC344': 'AC344',
    'AC350': 'AC359',
    'AC360': 'AC369',
    'AC363': 'AC032',
    'AC37_39': 'AC37',
    'AC380': 'AC389',
    'AC38A': 'AC38_X_382-383',
    'AC38B': 'AC382_383',
    'AC3_TR': 'AC3_713_936',
    'AC3_X_38': 'AC3_713_X_38',
    'AC400': 'AC4',
    'AC410': 'AC41',
    'AC412': 'AC411',
    'AC419': 'AC41',
    'AC420': 'AC429',
    'AC421': 'AC429',
    'AC422': 'AC429',
    'AC423': 'AC429',
    'AC424': 'AC421',
    'AC425': 'AC429',
    'AC426': 'AC422',
    'AC427': 'AC424',
    'AC428': 'AC425',
    'AC430': 'AC439',
    'AC41A': 'AC439',
    'AC42A': 'AC439',
    'AC43A': 'AC432',
    'AC4-8': 'AC4-8_998_X_713',
    'AC4-8A': 'AC4-8_998_X_713_821',
    'AC4-8NSP': 'AC998',
    'AC51A': 'AC512_513_519',
    'AC51B': 'AC519',
    'AC52A': 'AC52',
    'AC500': 'AC5',
    'AC510': 'AC519',
    'AC520': 'AC529',
    'AC522A': 'AC522',
    'AC523H': 'AC523',
    'AC6A': 'AC6_X_611',
    'AC600': 'AC619',
    'AC610': 'AC61',
    'AC616': 'AC615',
    'AC617': 'AC616',
    'AC620': 'AC62',
    'AC622': 'AC621',
    'AC629': 'AC62',
    'AC7A': 'AC72',
    'AC7B': 'AC711_712_719_731_732_739',
    'AC700': 'AC719',
    'AC710': 'AC71',
    'AC712': 'AC711',
    'AC713': 'AC711',
    'AC720': 'AC719',
    'AC721': 'AC712',
    'AC722': 'AC721',
    'AC723': 'AC722',
    'AC724': 'AC515',
    'AC725': 'AC729',
    'AC726': 'AC719',
    'AC729': 'AC719',
    'AC730': 'AC739',
    'AC734': 'AC731',
    'AC800': 'AC8',
    'AC811': 'AC811',
    'AC810': 'AC819',
    'AC822': 'AC821',
    'AC830': 'AC831',
    'AC832': 'AC831',
    'AC90NSP': 'AC900',
    'AC901': 'AC900',
    'AC911': 'AC910',
    'AC912': 'AC910',
    'AC913': 'AC910',
    'AC921': 'AC920',
    'AC922': 'AC920',
    'AC931': 'AC939',
    'AC941': 'AC940',
    'AC942': 'AC950',
    'AC943': 'AC940-980',
    'AC951': 'AC950',
    'AC952': 'AC960',
    'AC961': 'AC900',
    'AC971': 'AC900',
    'AC981': 'AC980',
    'AC982': 'AC900',
    'AC99NSP': 'AC999',
    'AC9A': 'AC9_X_910',
    'AC9B': 'AC920',
    'AC9C': 'AC939',
    'AC9D': 'AC940-980',
    'AC9E': 'AC910_920',
    'NSP': 'AC9',
    'AC_NP_MAIN': 'AC_NP_MAIN',
    'AC_NP_SEC': 'AC_NP_SEC',
    'AC_PNP_MAIN': 'AC_PNP_MAIN',
}


def load_observations_dataset(args: argparse.Namespace) -> Dataset:
    token = os.environ.get(args.token_env, "").strip() or None

    if args.local_dataset_dir and args.local_dataset_dir.exists():
        maybe_dict = load_from_disk(str(args.local_dataset_dir))
        if isinstance(maybe_dict, DatasetDict):
            if args.config not in maybe_dict:
                available = ", ".join(str(key) for key in maybe_dict.keys())
                raise KeyError(
                    f"Config '{args.config}' not found in local dataset. Available: {available}"
                )
            return maybe_dict[args.config]

    return load_dataset(args.repo_id, args.config, split=args.split, token=token)


def _norm(value: Any) -> str:
    if value is None:
        return ""
    out = str(value).strip()
    return "" if out.lower() == "nan" else out


def enrich_acl_batch(
    batch: dict[str, list[Any]],
    *,
    column_name: str,
    mapping: dict[str, str],
) -> dict[str, list[str]]:
    acl18_values = batch.get("acl18", [])
    acl00_values = batch.get("acl00", [])

    if len(acl18_values) != len(acl00_values):
        raise ValueError("acl18 and acl00 columns have different batch lengths.")

    unified: list[str] = []
    for acl18_raw, acl00_raw in zip(acl18_values, acl00_values):
        acl18 = _norm(acl18_raw)
        acl00 = _norm(acl00_raw)

        if acl18:
            unified.append(acl18)
            continue

        if acl00:
            unified.append(mapping.get(acl00, acl00))
            continue

        unified.append("")

    return {column_name: unified}


def validate_required_columns(dataset: Dataset) -> None:
    required = {"acl00", "acl18"}
    missing = sorted(required - set(dataset.column_names))
    if missing:
        raise KeyError(
            f"Dataset is missing required column(s): {', '.join(missing)}"
        )


def is_non_missing(value: Any) -> bool:
    if value is None:
        return False
    text = str(value).strip()
    return bool(text) and text.lower() != "nan"


def compute_acl_stats(dataset: Dataset, mapping: dict[str, str]) -> dict[str, Any]:
    df = cast(pd.DataFrame, dataset.to_pandas())
    df = df[["acl00", "acl18", "unified_acl_codes"]]
    acl18_mask = df["acl18"].apply(is_non_missing)
    acl00_mask = df["acl00"].apply(is_non_missing)

    rows_with_acl18 = int(acl18_mask.sum())
    rows_with_acl00 = int(acl00_mask.sum())
    rows_using_acl00 = int((~acl18_mask & acl00_mask).sum())
    rows_unmapped_acl00 = int(
        (~acl18_mask & acl00_mask & ~df["acl00"].astype(str).str.strip().isin(mapping)).sum()
    )
    rows_neither = int((~acl18_mask & ~acl00_mask).sum())

    unique_acl18 = sorted(set(df.loc[acl18_mask, "acl18"].astype(str).str.strip()))
    unique_acl00 = sorted(set(df.loc[acl00_mask, "acl00"].astype(str).str.strip()))
    unique_unified = sorted(set(df.loc[df["unified_acl_codes"].apply(is_non_missing), "unified_acl_codes"].astype(str).str.strip()))

    return {
        "rows_total": len(df),
        "rows_with_acl18": rows_with_acl18,
        "rows_with_acl00": rows_with_acl00,
        "rows_using_acl00_mapping": rows_using_acl00,
        "rows_unmapped_acl00": rows_unmapped_acl00,
        "rows_neither_acl18_nor_acl00": rows_neither,
        "unique_acl18_codes": len(unique_acl18),
        "unique_acl00_codes": len(unique_acl00),
        "unique_unified_codes": len(unique_unified),
        "mapping_entries_total": len(mapping),
    }


def maybe_apply_smoke_limit(dataset: Dataset, max_rows: int) -> Dataset:
    if max_rows <= 0:
        return dataset
    row_count = min(max_rows, len(dataset))
    print(f"Smoke mode enabled: processing first {row_count} rows.")
    return dataset.select(range(row_count))


def push_updated_dataset(updated: Dataset, args: argparse.Namespace) -> None:
    token = os.environ.get(args.token_env, "").strip()
    if not token:
        raise ValueError(
            f"Push requested but {args.token_env} is empty. Set it in environment or .env."
        )

    target_repo_id = args.target_repo_id.strip() or args.repo_id.strip()
    target_config = args.target_config.strip() or args.config.strip()
    target_split = args.target_split.strip() or args.split.strip()

    if not target_repo_id:
        raise ValueError("Push requested but no repository id was provided.")

    updated.push_to_hub(
        repo_id=target_repo_id,
        config_name=target_config,
        split=target_split,
        token=token,
        private=args.private,
    )

    print(
        "Pushed updated dataset split to Hub: "
        f"repo_id={target_repo_id} config={target_config} split={target_split}"
    )


def main() -> None:
    args = parse_args()

    script_root = Path(__file__).resolve().parent
    load_local_env(script_root / ".env")

    mapping = ACL00_TO_ACL18_MAPPING

    dataset = load_observations_dataset(args)
    validate_required_columns(dataset)
    dataset = maybe_apply_smoke_limit(dataset, int(args.max_rows or 0))

    updated = dataset.map(
        enrich_acl_batch,
        batched=True,
        fn_kwargs={"column_name": args.column_name, "mapping": mapping},
        desc=f"Adding '{args.column_name}'",
    )

    args.output_dir.mkdir(parents=True, exist_ok=True)
    updated.save_to_disk(str(args.output_dir))

    print(f"Loaded rows: {len(updated)}")
    print(f"Created column: {args.column_name}")
    print(f"Parsed mapping entries: {len(mapping)}")
    print(f"Saved updated dataset to: {args.output_dir.resolve()}")

    stats = compute_acl_stats(updated, mapping)
    print("\nACL harmonization stats:")
    print(f"  total rows: {stats['rows_total']}")
    print(f"  rows with acl18: {stats['rows_with_acl18']}")
    print(f"  rows with acl00: {stats['rows_with_acl00']}")
    print(f"  rows using acl00 mapping: {stats['rows_using_acl00_mapping']}")
    print(f"  rows with unmapped acl00: {stats['rows_unmapped_acl00']}")
    print(f"  rows with neither acl18 nor acl00: {stats['rows_neither_acl18_nor_acl00']}")
    print(f"  unique acl18 values: {stats['unique_acl18_codes']}")
    print(f"  unique acl00 values: {stats['unique_acl00_codes']}")
    print(f"  unique unified values: {stats['unique_unified_codes']}")

    if args.push_to_hub:
        push_updated_dataset(updated, args)


if __name__ == "__main__":
    main()
