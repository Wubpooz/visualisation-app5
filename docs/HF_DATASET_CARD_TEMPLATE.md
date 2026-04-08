---
license: cc-by-4.0
pretty_name: HETUS Harmonized Time Use (Eurostat TSV + ESMS metadata)
task_categories:
  - tabular-classification
  - text-classification
language:
  - en
---

# Dataset Card: HETUS Time Use (Converted from Eurostat TSV)

## Dataset Summary

This dataset contains normalized tabular observations converted from Eurostat HETUS TSV files, plus flattened SDMX ESMS metadata.

The conversion is performed by `db-hf-normalization.py` and preserves raw TSV tokens to prevent information loss during normalization.

## Source Data

- Original source: Eurostat HETUS database exports (TSV + SDMX XML metadata)
- Local source folder: `hetus/`
- Waves currently included: `2000_2010`, `2020`

## Conversion Method

The converter:

1. Reads TSV files as tab-separated raw text (no NA auto-coercion).
2. Expands packed dimension keys from the first column.
3. Melts year/time columns into long format.
4. Preserves exact raw source tokens for auditability:
   - `source_key_raw`
   - `time_period_raw`
   - `observation_cell_raw`
5. Creates normalized fields for analysis:
   - `time_period`, `time_period_year`
   - `observation`, `observation_value`, `duration_minutes`, `status_flag`
6. Validates strict lossless mapping per file (1:1 source cell preservation).

## Splits

### `observations`

Long-format observations.

Core provenance fields:

- `dataset_id`
- `wave`
- `source_file`
- `metadata_file`
- `source_row_index`
- `source_key_raw`
- `time_period_raw`
- `observation_cell_raw`

Normalized fields:

- `time_period`
- `time_period_year`
- `observation_raw`
- `observation`
- `observation_value`
- `duration_minutes`
- `status_flag`
- `is_missing`

Dimension fields (vary by source table, unioned into one schema):

- Examples: `freq`, `unit`, `sex`, `age`, `geo`, `acl00`, `acl18`, ...

### `files`

Per-source-file conversion and validation report:

- `rows_wide`
- `rows_long`
- `rows_expected_long`
- `lossless_validated`
- dimensions/time-period summaries

### `metadata`

Flattened SDMX ESMS metadata attributes with:

- attribute id/path
- HTML value (`value_html`)
- plain-text value (`value_text`)

## Data Loss / Integrity Statement

For each TSV file, conversion enforces:

- Exact row cardinality: `rows_long == rows_wide * number_of_time_period_columns`
- Exact cell-level preservation of raw source tuples:
  `(source_row_index, source_key_raw, time_period_raw, observation_cell_raw)`

If any mismatch is detected, conversion fails for that file.

## Known Caveats

- The first TSV column stores packed dimensions separated by commas. The converter keeps both:
  - raw packed key (`source_key_raw`)
  - expanded normalized dimensions
- Whitespace around values may be normalized in analytical columns, but the raw fields remain preserved.

## Intended Uses

- Comparative time-use analysis across countries, years, demographic strata, and activity codes.
- Reproducible ETL pipelines where raw-source lineage is required.

## Out-of-Scope Uses

- Any individual-level inference (dataset is aggregate tabular statistics).

## Citation

Please cite Eurostat HETUS and include repository/version information for this converted dataset.

## Dataset Version

- Converter script: `db-hf-normalization.py`
- Conversion date: {{YYYY-MM-DD}}
- Repository commit: {{GIT_COMMIT_SHA}}
