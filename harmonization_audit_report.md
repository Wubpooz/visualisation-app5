# HETUS Harmonization Audit

Generated at: `2026-04-03T09:41:40.978424+00:00`

## Dataset

- Rows: **1680915**  Columns: **34**  Waves: **2000_2010, 2020**

## ACL00 vs ACL18

- Non-missing counts: `acl00=1397370`, `acl18=275148`, `both=0`
- Raw code overlap: `shared=16`, `acl00_only=53`, `acl18_only=40`
Exact string overlap: 16 codes only
(AC0, AC01, AC03, AC2, AC212, AC321, AC35, AC36, AC38, AC511, AC52, AC611, AC81, AC812, AC936, TOTAL)

| wave | rows | acl00_non_missing | acl18_non_missing | both_non_missing |
| --- | --- | --- | --- | --- |
| 2000_2010 | 1398954 | 1397370 | 0 | 0 |
| 2020 | 281961 | 0 | 275148 | 0 |

## Nullability

- Strict-null columns: **0**
- Wave-specific columns: `acl00 (2000_2010)`, `hhstatus (2000_2010)`, `isced97 (2000_2010)`, `tra_mode (2000_2010)`, `acl18 (2020)`, `hhcomp (2020)`, `isced11 (2020)`, `status_flag (2020)`

| column | non_missing | missing | missing_pct |
| --- | --- | --- | --- |
| tra_mode | 660 | 1680255 | 99.961 |
| status_flag | 24396 | 1656519 | 98.549 |
| hhcomp | 30240 | 1650675 | 98.201 |
| isced11 | 30240 | 1650675 | 98.201 |
| daysweek | 84231 | 1596684 | 94.989 |
| isced97 | 148158 | 1532757 | 91.186 |
| startime | 191835 | 1489080 | 88.587 |
| age | 254007 | 1426908 | 84.889 |
| acl18 | 275148 | 1405767 | 83.631 |
| hhstatus | 275688 | 1405227 | 83.599 |
| month | 331317 | 1349598 | 80.289 |
| wstatus | 332031 | 1348884 | 80.247 |
| observation_value | 521793 | 1159122 | 68.958 |
| duration_minutes | 708575 | 972340 | 57.846 |
| observation | 1268615 | 412300 | 24.528 |
| acl00 | 1397370 | 283545 | 16.868 |
| sex | 1679727 | 1188 | 0.071 |
| dataset_id | 1680915 | 0 | 0.000 |
| wave | 1680915 | 0 | 0.000 |
| source_file | 1680915 | 0 | 0.000 |
| metadata_file | 1680915 | 0 | 0.000 |
| source_row_index | 1680915 | 0 | 0.000 |
| source_key_raw | 1680915 | 0 | 0.000 |
| dimension_order_raw | 1680915 | 0 | 0.000 |
| dimension_order | 1680915 | 0 | 0.000 |
| time_period_raw | 1680915 | 0 | 0.000 |
| time_period | 1680915 | 0 | 0.000 |
| time_period_year | 1680915 | 0 | 0.000 |
| observation_cell_raw | 1680915 | 0 | 0.000 |
| observation_raw | 1680915 | 0 | 0.000 |

## Suggested merge candidates (wave-specific columns)

| column_a | wave_a | column_b | wave_b | shared_unique | jaccard | reason |
| --- | --- | --- | --- | --- | --- | --- |
| isced97 | 2000_2010 | isced11 | 2020 | 4 | 0.400 | same_name_stem_and_partial_value_overlap |

## Cross-wave domain overlap (dimension columns)

| column | classification | shared_count | jaccard | unique_2000_2010 | unique_2020 |
| --- | --- | --- | --- | --- | --- |
| freq | aligned | 1 | 1.000 | 1 | 1 |
| sex | aligned | 3 | 1.000 | 3 | 3 |
| startime | aligned | 145 | 1.000 | 145 | 145 |
| unit | aligned | 3 | 1.000 | 3 | 3 |
| wstatus | aligned | 14 | 1.000 | 14 | 14 |
| month | partial_overlap | 13 | 0.619 | 13 | 21 |
| daysweek | partial_overlap | 3 | 0.429 | 3 | 7 |
| geo | partial_overlap | 7 | 0.318 | 22 | 7 |
| age | partial_overlap | 4 | 0.200 | 8 | 16 |
| acl00 | wave_specific | 0 | 0.000 | 69 | 0 |
| acl18 | wave_specific | 0 | 0.000 | 0 | 56 |
| hhcomp | wave_specific | 0 | 0.000 | 0 | 8 |
| hhstatus | wave_specific | 0 | 0.000 | 12 | 0 |
| isced11 | wave_specific | 0 | 0.000 | 0 | 8 |
| isced97 | wave_specific | 0 | 0.000 | 6 | 0 |
| tra_mode | wave_specific | 0 | 0.000 | 5 | 0 |