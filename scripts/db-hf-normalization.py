# pyright: reportMissingImports=false, reportMissingModuleSource=false
"""Normalize HETUS TSV + SDMX metadata into a Hugging Face Dataset.

This script converts the Eurostat HETUS files under `hetus/` into a single
Hugging Face dataset with three splits:

- `observations`: all table observations in long format, with `time_period`
  preserved as requested.
- `files`: per-source-file lineage and shape information.
- `metadata`: flattened ESMS SDMX metadata attributes.

Usage examples:
  python db-hf-normalization.py
  python db-hf-normalization.py --max-files 2 --overwrite
  python db-hf-normalization.py --push-to-hub --repo-id your-user/hetus-time-use
"""

from __future__ import annotations

import argparse
import html
import json
import logging
import os
import re
import shutil
import xml.etree.ElementTree as ET
from dataclasses import dataclass
from pathlib import Path
from typing import Any

import pandas as pd
from datasets import DatasetDict, Features, Value, load_dataset


NS = {
	"msg": "http://www.sdmx.org/resources/sdmxml/schemas/v3_0/message",
	"common": "http://www.sdmx.org/resources/sdmxml/schemas/v3_0/common",
	"generic": "http://www.sdmx.org/resources/sdmxml/schemas/v3_0/metadata/generic",
}

NUMERIC_RE = re.compile(r"^-?\d+(?:\.\d+)?$")
HHMM_RE = re.compile(r"^(\d{1,2}):(\d{2})$")
YEAR_RE = re.compile(r"^\d{4}$")


@dataclass(frozen=True)
class WaveInput:
	wave: str
	metadata_file: Path | None
	tsv_files: list[Path]


def parse_args() -> argparse.Namespace:
	script_root = Path(__file__).resolve().parent
	repo_root = script_root.parent
	parser = argparse.ArgumentParser(
		description="Convert HETUS TSV+metadata files to a Hugging Face dataset."
	)
	parser.add_argument(
		"--hetus-root",
		type=Path,
		default=repo_root / "hetus",
		help="Root directory containing HETUS wave folders (default: ../hetus).",
	)
	parser.add_argument(
		"--output-dir",
		type=Path,
		default=repo_root / "hf_export",
		help="Output directory for intermediate files and saved HF dataset.",
	)
	parser.add_argument(
		"--max-files",
		type=int,
		default=None,
		help="Optional cap for number of TSV files to process (useful for quick tests).",
	)
	parser.add_argument(
		"--overwrite",
		action="store_true",
		help="Delete existing output directory before rebuilding.",
	)
	parser.add_argument(
		"--push-to-hub",
		action="store_true",
		help="Push the resulting DatasetDict to Hugging Face Hub.",
	)
	parser.add_argument(
		"--repo-id",
		type=str,
		default="",
		help="Target HF dataset repo (e.g. username/hetus-time-use).",
	)
	parser.add_argument(
		"--private",
		action="store_true",
		help="Create/update Hub dataset as private (when pushing).",
	)
	parser.add_argument(
		"--token-env",
		type=str,
		default="HF_TOKEN",
		help="Environment variable name holding the HF token.",
	)
	return parser.parse_args()


def load_local_env(dotenv_path: Path) -> None:
	"""Minimal .env loader (no extra dependency required)."""
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


def to_posix_rel(path: Path, start: Path) -> str:
	return str(path.relative_to(start)).replace("\\", "/")


def strip_html(text: str) -> str:
	# The metadata values are HTML-escaped snippets; for many downstream tasks,
	# plain text is more practical.
	unescaped = html.unescape(text)
	return re.sub(r"<[^>]+>", " ", unescaped).replace("\xa0", " ").strip()


def discover_wave_inputs(hetus_root: Path) -> list[WaveInput]:
	if not hetus_root.exists() or not hetus_root.is_dir():
		raise FileNotFoundError(f"HETUS root not found: {hetus_root}")

	# Accept both:
	# 1) a parent folder containing wave subfolders (e.g. hetus/2000_2010, hetus/2020)
	# 2) a direct wave folder containing TSV files.
	direct_tsv_files = sorted(hetus_root.glob("*.tsv"))
	if direct_tsv_files:
		metadata_candidates = sorted(hetus_root.glob("*_esms.sdmx.xml"))
		metadata_file = metadata_candidates[0] if metadata_candidates else None
		return [
			WaveInput(
				wave=hetus_root.name,
				metadata_file=metadata_file,
				tsv_files=direct_tsv_files,
			)
		]

	waves: list[WaveInput] = []
	for wave_dir in sorted(p for p in hetus_root.iterdir() if p.is_dir()):
		tsv_files = sorted(wave_dir.glob("*.tsv"))
		if not tsv_files:
			continue

		metadata_candidates = sorted(wave_dir.glob("*_esms.sdmx.xml"))
		metadata_file = metadata_candidates[0] if metadata_candidates else None
		waves.append(WaveInput(wave=wave_dir.name, metadata_file=metadata_file, tsv_files=tsv_files))

	if not waves:
		raise RuntimeError(f"No TSV files found under: {hetus_root}")

	return waves


def extract_dimensions_from_header(tsv_file: Path) -> list[str]:
	header_line = tsv_file.read_text(encoding="utf-8").splitlines()[0]
	first_col = header_line.split("\t", 1)[0]
	dim_part = first_col.split("\\TIME_PERIOD", 1)[0]
	return [d.strip() for d in dim_part.split(",") if d.strip()]


def collect_dimension_union(tasks: list[tuple[str, Path, Path | None]]) -> list[str]:
	dim_union: set[str] = set()
	for _, tsv_file, _ in tasks:
		dim_union.update(extract_dimensions_from_header(tsv_file))
	return sorted(dim_union)


def parse_metadata_file(metadata_file: Path, wave: str, hetus_root: Path) -> list[dict[str, Any]]:
	tree = ET.parse(metadata_file)
	root = tree.getroot()

	prepared = root.findtext("msg:Header/msg:Prepared", default="", namespaces=NS)
	metadata_set = root.find("msg:MetadataSet", NS)
	metadata_set_id = metadata_set.attrib.get("id", "") if metadata_set is not None else ""

	rows: list[dict[str, Any]] = []
	metadata_rel = to_posix_rel(metadata_file, hetus_root)

	def walk(attr_node: ET.Element, parent_ids: list[str]) -> None:
		attr_id = attr_node.attrib.get("id", "")
		current_path = [*parent_ids, attr_id] if attr_id else parent_ids

		value_html = (attr_node.findtext("generic:Value", default="", namespaces=NS) or "").strip()
		value_text = strip_html(value_html)

		rows.append(
			{
				"wave": wave,
				"metadata_file": metadata_rel,
				"prepared_at": prepared,
				"metadata_set_id": metadata_set_id,
				"attribute_id": attr_id,
				"attribute_path": "/".join(current_path),
				"value_html": value_html,
				"value_text": value_text,
			}
		)

		for child in attr_node.findall("generic:Attribute", NS):
			walk(child, current_path)

	if metadata_set is not None:
		for attr in metadata_set.findall("generic:Attribute", NS):
			walk(attr, [])

	return rows


def expand_dimension_values(df: pd.DataFrame, first_col: str, dim_names: list[str]) -> pd.DataFrame:
	"""Split packed dimension tuples from first TSV column into explicit columns."""
	split_rows: list[list[str]] = []
	expected_dims = len(dim_names)

	for row_idx, raw_value in enumerate(df[first_col].tolist()):
		raw = str(raw_value)
		parts = raw.split(",")
		if len(parts) != expected_dims:
			raise ValueError(
				f"Packed dimension key has {len(parts)} tokens but {expected_dims} expected "
				f"at row {row_idx}: {raw!r}"
			)
		split_rows.append(parts)

	return pd.DataFrame(split_rows, columns=dim_names)


def parse_observation_cells(
	cell_series: pd.Series,
	) -> tuple[pd.Series, pd.Series, pd.Series, pd.Series, pd.Series, pd.Series]:
	"""Parse observation text, numeric values, HH:MM durations, and quality flags."""
	cell_raw = cell_series.fillna("").astype(str)
	cell_stripped = cell_raw.str.strip()
	extracted = cell_stripped.str.extract(r"^(?P<obs>\S*)(?:\s+(?P<flag>.*))?$")

	observation = extracted["obs"].replace("", pd.NA).mask(extracted["obs"] == ":")
	status_flag = extracted["flag"].replace("", pd.NA)

	numeric_mask = observation.str.match(NUMERIC_RE.pattern, na=False)
	observation_numeric = pd.to_numeric(observation.where(numeric_mask), errors="coerce")
	observation_value = pd.Series(observation_numeric, index=observation.index)

	hhmm_mask = observation.str.match(HHMM_RE.pattern, na=False)
	duration_minutes = pd.Series(pd.NA, index=cell_raw.index, dtype="Int64")
	if hhmm_mask.any():
		hhmm_parts = observation[hhmm_mask].str.split(":", n=1, expand=True)
		duration_minutes.loc[hhmm_mask] = (
			hhmm_parts[0].astype("Int64") * 60 + hhmm_parts[1].astype("Int64")
		).astype("Int64")

	return cell_raw, cell_stripped, observation, status_flag, observation_value, duration_minutes


def assert_lossless_cell_mapping(
	source_long: pd.DataFrame,
	canonical: pd.DataFrame,
	tsv_file: Path,
) -> None:
	"""Assert that every raw source cell is preserved 1:1 in canonical output."""
	if len(source_long) != len(canonical):
		raise ValueError(
			f"Lossless validation failed for {tsv_file.name}: "
			f"row count mismatch ({len(source_long)} != {len(canonical)})"
		)

	source_sig = (
		source_long["__source_row_index"].astype(str)
		+ "§"
		+ source_long["__source_key_raw"].astype(str)
		+ "§"
		+ source_long["time_period_raw"].astype(str)
		+ "§"
		+ source_long["observation_cell_raw"].astype(str)
	).value_counts(dropna=False)

	dest_sig = (
		canonical["source_row_index"].astype(str)
		+ "§"
		+ canonical["source_key_raw"].astype(str)
		+ "§"
		+ canonical["time_period_raw"].astype(str)
		+ "§"
		+ canonical["observation_cell_raw"].astype(str)
	).value_counts(dropna=False)

	if not source_sig.equals(dest_sig):
		diff_table = (
			source_sig.to_frame("src")
			.join(dest_sig.to_frame("dst"), how="outer")
			.fillna(0)
		)
		diff_table["delta"] = diff_table["src"] - diff_table["dst"]
		diff = diff_table[diff_table["delta"] != 0]["delta"]
		sample = diff.head(5).to_dict()
		raise ValueError(
			f"Lossless validation failed for {tsv_file.name}: "
			f"source/destination signatures differ. Sample: {sample}"
		)


def parse_time_period_columns(time_period_series: pd.Series) -> tuple[pd.Series, pd.Series]:
	"""Normalize time period text and derive integer year when possible."""
	time_period = time_period_series.astype(str).str.strip()
	time_period_year = pd.Series(pd.NA, index=time_period.index, dtype="Int64")
	year_mask = time_period.str.match(YEAR_RE.pattern, na=False)
	if year_mask.any():
		time_period_year.loc[year_mask] = [int(str(v)) for v in time_period[year_mask]]

	return time_period, time_period_year


def parse_tsv_to_normalized_csv(
	tsv_file: Path,
	wave: str,
	metadata_file: Path | None,
	hetus_root: Path,
	all_dimensions: list[str],
	out_csv: Path,
) -> dict[str, Any]:
	df = pd.read_csv(tsv_file, sep="\t", dtype=str, keep_default_na=False, na_filter=False)
	if df.empty:
		raise ValueError(f"TSV has no rows: {tsv_file}")

	first_col = str(df.columns[0])
	dim_part = first_col.split("\\TIME_PERIOD", 1)[0]
	dim_names = [d.strip() for d in dim_part.split(",") if d.strip()]
	if not dim_names:
		raise ValueError(f"Cannot infer dimensions from first column in {tsv_file}")

	# Expand packed dimensions from the first column.
	dim_values = expand_dimension_values(df, first_col, dim_names)
	dim_values_with_row = dim_values.copy()
	dim_values_with_row["__source_row_index"] = range(len(dim_values_with_row))

	source_df = df.copy()
	source_df.insert(0, "__source_row_index", range(len(source_df)))
	source_df = source_df.rename(columns={first_col: "__source_key_raw"})

	time_cols = [c for c in source_df.columns if c not in ["__source_row_index", "__source_key_raw"]]
	if not time_cols:
		raise ValueError(f"No TIME_PERIOD columns found in {tsv_file}")

	source_long = source_df.melt(
		id_vars=["__source_row_index", "__source_key_raw"],
		value_vars=time_cols,
		var_name="time_period_raw",
		value_name="observation_cell_raw",
	)

	long_df = source_long.merge(
		dim_values_with_row,
		on="__source_row_index",
		how="left",
		validate="many_to_one",
		sort=False,
	)

	# Parse observation + optional quality flag from cells like ": u" or "1:23 u".
	cell_raw, cell_stripped, observation, status_flag, observation_value, duration_minutes = parse_observation_cells(
		long_df["observation_cell_raw"]
	)
	time_period, time_period_year = parse_time_period_columns(long_df["time_period_raw"])

	canonical = pd.DataFrame(
		{
			"dataset_id": tsv_file.stem,
			"wave": wave,
			"source_file": to_posix_rel(tsv_file, hetus_root),
			"metadata_file": to_posix_rel(metadata_file, hetus_root) if metadata_file else "",
			"source_row_index": long_df["__source_row_index"],
			"source_key_raw": long_df["__source_key_raw"],
			"dimension_order_raw": dim_part,
			"dimension_order": ",".join(dim_names),
			"time_period_raw": long_df["time_period_raw"],
			"time_period": time_period,
			"time_period_year": time_period_year,
			"observation_cell_raw": cell_raw,
			"observation_raw": cell_stripped,
			"observation": observation,
			"observation_value": observation_value,
			"duration_minutes": duration_minutes,
			"status_flag": status_flag,
			"is_missing": observation.isna(),
		}
	)

	assert_lossless_cell_mapping(source_long, canonical, tsv_file)

	# Keep a stable schema across all files by materializing the full dimension union.
	for dim_name in all_dimensions:
		if dim_name in long_df.columns:
			canonical[dim_name] = long_df[dim_name].astype(str).str.strip()
		else:
			canonical[dim_name] = pd.NA

	out_csv.parent.mkdir(parents=True, exist_ok=True)
	canonical.to_csv(out_csv, index=False)

	return {
		"wave": wave,
		"dataset_id": tsv_file.stem,
		"source_file": to_posix_rel(tsv_file, hetus_root),
		"metadata_file": to_posix_rel(metadata_file, hetus_root) if metadata_file else "",
		"rows_wide": int(len(df)),
		"rows_long": int(len(canonical)),
		"rows_expected_long": int(len(df) * len(time_cols)),
		"lossless_validated": "true",
		"dimensions": json.dumps(dim_names, ensure_ascii=False),
		"time_periods_raw": json.dumps([str(c) for c in time_cols], ensure_ascii=False),
		"time_periods": json.dumps([str(c).strip() for c in time_cols], ensure_ascii=False),
	}


def build_intermediate_files(
	hetus_root: Path,
	output_dir: Path,
	max_files: int | None,
) -> tuple[list[Path], Path, Path, Path]:
	waves = discover_wave_inputs(hetus_root)

	tasks: list[tuple[str, Path, Path | None]] = []
	for wave in waves:
		for tsv in wave.tsv_files:
			tasks.append((wave.wave, tsv, wave.metadata_file))

	if max_files is not None:
		tasks = tasks[:max_files]

	if not tasks:
		raise RuntimeError("No TSV files selected for processing.")

	all_dimensions = collect_dimension_union(tasks)
	logging.info("Detected %d distinct dimension columns.", len(all_dimensions))

	intermediate_dir = output_dir / "intermediate"
	observations_dir = intermediate_dir / "observations"
	observations_dir.mkdir(parents=True, exist_ok=True)

	# Parse metadata once per used wave.
	used_waves = {wave for wave, _, _ in tasks}
	metadata_rows: list[dict[str, Any]] = []
	wave_metadata_lookup = {w.wave: w.metadata_file for w in waves}
	for wave in sorted(used_waves):
		metadata_file = wave_metadata_lookup.get(wave)
		if metadata_file and metadata_file.exists():
			metadata_rows.extend(parse_metadata_file(metadata_file, wave, hetus_root))

	obs_csv_paths: list[Path] = []
	files_rows: list[dict[str, Any]] = []

	for idx, (wave, tsv_file, metadata_file) in enumerate(tasks, start=1):
		logging.info("[%d/%d] Processing %s", idx, len(tasks), to_posix_rel(tsv_file, hetus_root))
		out_csv = observations_dir / f"{wave}__{tsv_file.stem}.csv"
		file_summary = parse_tsv_to_normalized_csv(
			tsv_file=tsv_file,
			wave=wave,
			metadata_file=metadata_file,
			hetus_root=hetus_root,
			all_dimensions=all_dimensions,
			out_csv=out_csv,
		)
		obs_csv_paths.append(out_csv)
		files_rows.append(file_summary)

	files_csv = intermediate_dir / "files.csv"
	metadata_csv = intermediate_dir / "metadata.csv"
	manifest_json = intermediate_dir / "manifest.json"

	pd.DataFrame(files_rows).to_csv(files_csv, index=False)
	metadata_columns = [
		"wave",
		"metadata_file",
		"prepared_at",
		"metadata_set_id",
		"attribute_id",
		"attribute_path",
		"value_html",
		"value_text",
	]
	pd.DataFrame(metadata_rows, columns=metadata_columns).to_csv(metadata_csv, index=False)

	manifest = {
		"hetus_root": str(hetus_root),
		"processed_tsv_files": len(tasks),
		"observation_csv_parts": [str(p) for p in obs_csv_paths],
		"files_csv": str(files_csv),
		"metadata_csv": str(metadata_csv),
		"dimension_columns": all_dimensions,
	}
	manifest_json.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")

	return obs_csv_paths, files_csv, metadata_csv, manifest_json


def build_dataset_dict(
	observation_csvs: list[Path],
	files_csv: Path,
	metadata_csv: Path,
) -> DatasetDict:
	def string_features(csv_file: Path) -> Features:
		cols = pd.read_csv(csv_file, nrows=0).columns.tolist()
		return Features({col: Value("string") for col in cols})

	observations = load_dataset(
		"csv",
		data_files=[str(p) for p in observation_csvs],
		split="train",
		features=string_features(observation_csvs[0]),
	)
	files = load_dataset(
		"csv",
		data_files=[str(files_csv)],
		split="train",
		features=string_features(files_csv),
	)
	metadata = load_dataset(
		"csv",
		data_files=[str(metadata_csv)],
		split="train",
		features=string_features(metadata_csv),
	)

	return DatasetDict(
		{
			"observations": observations,
			"files": files,
			"metadata": metadata,
		}
	)


def has_uniform_split_features(dataset_dict: DatasetDict) -> bool:
	"""Return True when all splits share the same feature schema."""
	split_names = list(dataset_dict.keys())
	if not split_names:
		return True

	base_features = dataset_dict[split_names[0]].features
	return all(dataset_dict[split].features == base_features for split in split_names[1:])


def push_dataset_dict_safely(
	dataset_dict: DatasetDict,
	repo_id: str,
	token: str,
	private: bool,
) -> None:
	"""Push DatasetDict to Hub, handling mixed split schemas when needed.

	Hugging Face Hub requires splits inside one config to share the same feature
	schema. This project intentionally uses three different tables/schemas
	(`observations`, `files`, `metadata`). If schemas differ, push one config per
	split while keeping each split's schema intact.
	"""
	if has_uniform_split_features(dataset_dict):
		dataset_dict.push_to_hub(repo_id=repo_id, token=token, private=private)
		logging.info("Pushed dataset to Hugging Face Hub as a single config: %s", repo_id)
		return

	logging.warning(
		"Split schemas differ; publishing one Hub config per split "
		"(observations/files/metadata)."
	)

	for index, split_name_raw in enumerate(dataset_dict.keys()):
		split_name = str(split_name_raw)
		dataset_dict[split_name_raw].push_to_hub(
			repo_id=repo_id,
			token=token,
			private=private,
			config_name=split_name,
			split="train",
			set_default=index == 0,
		)
		logging.info(
			"Pushed split '%s' to Hub config '%s' (split='train').",
			split_name,
			split_name,
		)


def main() -> None:
	logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
	args = parse_args()

	script_root = Path(__file__).resolve().parent
	load_local_env(script_root / ".env")

	hetus_root = args.hetus_root.resolve()
	output_dir = args.output_dir.resolve()

	if output_dir.exists() and args.overwrite:
		shutil.rmtree(output_dir)
	output_dir.mkdir(parents=True, exist_ok=True)

	obs_csvs, files_csv, metadata_csv, manifest_json = build_intermediate_files(
		hetus_root=hetus_root,
		output_dir=output_dir,
		max_files=args.max_files,
	)

	dataset_dict = build_dataset_dict(obs_csvs, files_csv, metadata_csv)

	dataset_out = output_dir / "hf_dataset"
	dataset_dict.save_to_disk(str(dataset_out))
	logging.info("Saved local DatasetDict to: %s", dataset_out)
	logging.info("Manifest written to: %s", manifest_json)
	logging.info(
		"Split sizes — observations: %d | files: %d | metadata: %d",
		len(dataset_dict["observations"]),
		len(dataset_dict["files"]),
		len(dataset_dict["metadata"]),
	)

	if args.push_to_hub:
		repo_id = args.repo_id or os.environ.get("HF_DATASET_REPO", "").strip()
		if not repo_id:
			raise ValueError(
				"Push requested but no repository specified. Use --repo-id or set HF_DATASET_REPO."
			)

		token = os.environ.get(args.token_env, "").strip()
		if not token:
			raise ValueError(
				f"Push requested but {args.token_env} is empty. "
				"Set your token in the environment or in .env."
			)

		push_dataset_dict_safely(
			dataset_dict=dataset_dict,
			repo_id=repo_id,
			token=token,
			private=args.private,
		)
		logging.info("Completed push to Hugging Face Hub: %s", repo_id)


if __name__ == "__main__":
	main()

