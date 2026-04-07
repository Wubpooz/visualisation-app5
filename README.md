# visualisation-app5
[Hugging Face Dataset](https://huggingface.co/datasets/Bluefir/hetus-time-use)

[HETUS Metadata](https://ec.europa.eu/eurostat/cache/metadata/en/tus_20_esms.htm)  
[HETUS Database](https://ec.europa.eu/eurostat/web/time-use-surveys/database)  
[HETUS Data Browser](https://ec.europa.eu/eurostat/databrowser/explore/all/popul?sort=category&lang=en&subtheme=livcon.tus.tus_20&display=list)  

## Database Reference
[HETUS Guidelines 2020](https://ec.europa.eu/eurostat/documents/3859598/11597606/KS-GQ-20-011-EN-N.pdf/2567be02-f395-f1d0-d64d-d375192d6f10?t=1607360062000)  
[HETUS data delivery guidelines 2020](https://ec.europa.eu/eurostat/documents/9986036/16055682/HETUS+wave+2020+-+Data+delivery+guidelines.pdf/a549a7cf-695a-2415-f990-61b302dab9fc?t=1675438030799)  
[HETUS Data Delivery Guidelines](https://ec.europa.eu/eurostat/web/products-manuals-and-guidelines/-/KS-GQ-20-011)  
[Codes Activités](https://ec.europa.eu/eurostat/databrowser/bulk?lang=en&selectedTab=codeList#:~:text=ACCIDENT&text=ACL00,tsv%20%7C%20sdmx%202.1)


## Animation Reference
[Staggered Grid Example - Motion.dev](https://motion.dev/examples/js-staggered-grid?platform=js)   
[Animated Waffle Charts with D3 and GSAP](https://www.williamrchase.com/writing/2019-10-13-animated-waffle-charts-with-d3-and-gsap)  



## Conversion
1) Set your environement:  
    ```bash
    python -m venv .venv_hf
    .\.venv_hf\Scripts\activate.bat
    pip install -r requirements.txt
    ```
2) Set your Hugging Face token and repository in `.env`.  
3) Smoke run:  
    ```bash
    python .\db-hf-normalization.py --hetus-root .\hetus\2020 --max-files 1 --overwrite
    ```
4) Full run:  
    ```bash
    python .\db-hf-normalization.py --hetus-root .\hetus --overwrite
    ```
5) Validation:  
    ```bash
    python -c "import pandas as pd; f=pd.read_csv('hf_export/intermediate/files.csv'); s=f['lossless_validated']; print('all_lossless=', s.astype(str).str.strip().str.lower().eq('true').all()); print('rows_match=', (f['rows_long']==f['rows_expected_long']).all()); print('files=', len(f))"
    ```
    And you should see:  
    ```
    all_lossless= True
    rows_match= True
    ```
6) To push to Hugging Face:  
    ```bash
    python .\db-hf-normalization.py --hetus-root .\hetus --overwrite --push-to-hub
    ```
    Since the three tables have different schemas, the script publishes one Hub
    config per table: `observations`, `files`, `metadata`.

7) Load from Hugging Face (example):  
    ```bash
    python -c "from datasets import load_dataset; print(load_dataset('Bluefir/hetus-time-use', 'observations', split='train'))"
    ```

## Quick chart: time by age/category/year

Generate a small graph from the published HF dataset (`observations` config):

```bash
python .\plot_hf_age_category_year.py --repo-id Bluefir/hetus-time-use --geo DE --sex T --unit TIME_SP --max-categories 4 --output .\hf_export\age_category_by_year.png
```

Notes:
- `--geo DE` is a good default for full 2000/2010/2020 coverage.
- For a private dataset repo, set `HF_TOKEN` in `.env` (or environment).
- You can also run against local exported data with `--local-dataset-dir .\hf_export\hf_dataset`.

## Harmonization audit (ACL00 vs ACL18 + nullability)

Generate a compatibility report to inspect:
- ACL00/ACL18 overlap and incompatibilities
- strict-null and wave-specific fields
- cross-wave domain overlap for dimension columns
- suggested merge candidates for wave-specific fields

```bash
python .\hf_harmonization_audit.py --local-dataset-dir .\hf_export\hf_dataset --output-json .\hf_export\harmonization_audit_report.json --output-md .\hf_export\harmonization_audit_report.md
```

If `--local-dataset-dir` does not exist, the script falls back to loading from Hugging Face (`--repo-id`, `--config`, `--split`).

## Add `unified_acl_codes` column (ACL18 harmonized)

Use `add_unified_acl18_column.py` to create a new `unified_acl_codes` column in the `observations` table:
- if `acl18` is present, keep it;
- otherwise map `acl00` using **Full Review and Mappings** from `acl00_acl18_mapping_need.md`.
- Mapping is embedded in the script and has been validated against the markdown source.
- After processing, the script prints statistics for rows with `acl18`, rows with mapped `acl00`, unmapped `acl00`, and unique code counts.

Small local smoke run:

```bash
python .\add_unified_acl18_column.py --local-dataset-dir .\hf_export\hf_dataset --config observations --max-rows 2000 --output-dir .\hf_export\hf_dataset_unified_acl_smoke
```

Full local run:

```bash
python .\add_unified_acl18_column.py --local-dataset-dir .\hf_export\hf_dataset --config observations --output-dir .\hf_export\hf_dataset_unified_acl
```

Push updated split to Hugging Face Hub:

```bash
python .\add_unified_acl18_column.py --repo-id Bluefir/hetus-time-use --config observations --push-to-hub --target-repo-id Bluefir/hetus-time-use --target-config observations --target-split train
```
