# visualisation-app5
[HETUS Metadata](https://ec.europa.eu/eurostat/cache/metadata/en/tus_20_esms.htm)  
[HETUS Database](https://ec.europa.eu/eurostat/web/time-use-surveys/database)  
[HETUS Data Browser](https://ec.europa.eu/eurostat/databrowser/explore/all/popul?sort=category&lang=en&subtheme=livcon.tus.tus_20&display=list)  

## Database Reference
[HETUS guidelines](https://ec.europa.eu/eurostat/documents/9986036/16055682/HETUS+wave+2020+-+Data+delivery+guidelines.pdf/a549a7cf-695a-2415-f990-61b302dab9fc?t=1675438030799)  
[HETUS Data Delivery Guidelines](https://ec.europa.eu/eurostat/web/products-manuals-and-guidelines/-/KS-GQ-20-011)  
[HETUS Guidelines](https://ec.europa.eu/eurostat/documents/3859598/11597606/KS-GQ-20-011-EN-N.pdf/2567be02-f395-f1d0-d64d-d375192d6f10?t=1607360062000)  


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
    python -c "from datasets import load_dataset; print(load_dataset('Wupbooz/hetus-time-use', 'observations', split='train'))"
    ```
