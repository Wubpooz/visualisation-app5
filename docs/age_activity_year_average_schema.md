# Schema explicatif du JSON extrait

Ce document decrit la structure du fichier `hf_export/age_activity_year_average.json` genere par `extract_json-data.py`.

## Objectif du fichier

Le JSON contient:

- les metadonnees de l'extraction
- les annees et groupes d'age harmonises
- les categories d'activite retenues
- pour chaque `annee x groupe d'age`:
  - les pourcentages `shared_pct`, `alone_pct`, `other_pct`
  - les moyennes de temps pour les categories affichees

Les pourcentages sociaux sont calcules a partir de toutes les activites classees dans [docs/observations-count-by-unified-acl-codes.md](/c:/Users/lenovo/Documents/APP5/VisualisationD/visualisation-app5/docs/observations-count-by-unified-acl-codes.md), en excluant celles marquees `none`.

## Arborescence generale

```text
root
|- generated_at_utc
|- dataset
|  |- repo_id
|  |- config
|  |- split
|  |- local_dataset_dir
|  |- activity_category_source
|- extraction
|  |- include_partial_categories
|  |- all_categories
|  |- using_default_categories
|  |- missing_default_categories
|- years
|- age_groups
|- age_group_source_codes
|  |- "10-24"
|  |- "25-44"
|  |- "45-64"
|  |- "65+"
|- activity_categories
|- summary
|  |- filtered_rows
|  |- aggregated_rows_with_data
|  |- output_records
|- values
   |- "2000"
   |  |- "10-24"
   |  |  |- shared_pct
   |  |  |- alone_pct
   |  |  |- other_pct
   |  |  |- "AC01"
   |  |  |  |- average_minutes
   |  |  |  |- observation_count
```

## Description des blocs

| Champ | Type | Role |
| --- | --- | --- |
| `generated_at_utc` | `string` | Date/heure UTC de generation du fichier. |
| `dataset` | `object` | Source du dataset et mode de chargement. |
| `extraction` | `object` | Parametres utilises pour choisir les categories exportees. |
| `years` | `array<number>` | Annees presentes dans l'extraction. |
| `age_groups` | `array<string>` | Groupes d'age harmonises presents dans le resultat. |
| `age_group_source_codes` | `object<string, array<string>>` | Mapping entre groupes harmonises et codes source. |
| `activity_categories` | `array<string>` | Categories d'activite exportees dans chaque noeud `values`. |
| `summary` | `object` | Statistiques globales de l'extraction. |
| `values` | `object` | Resultat final indexe par `annee`, puis `groupe d'age`. |

## Detail des objets

### `dataset`

```json
{
  "repo_id": "Bluefir/hetus-time-use",
  "config": "observations",
  "split": "train",
  "local_dataset_dir": "hf_export\\hf_dataset_unified_acl",
  "activity_category_source": "unified_acl_codes"
}
```

- `repo_id`: dataset Hugging Face utilise.
- `config`: configuration chargee.
- `split`: split charge.
- `local_dataset_dir`: dataset local utilise s'il existe.
- `activity_category_source`: colonne utilisee pour identifier les categories d'activite.

### `extraction`

```json
{
  "include_partial_categories": false,
  "all_categories": false,
  "using_default_categories": true,
  "missing_default_categories": ["AC1_2"]
}
```

- `include_partial_categories`: si `false`, seules les categories presentes sur toutes les annees retenues sont gardees.
- `all_categories`: si `true`, toutes les categories disponibles sont exportees.
- `using_default_categories`: indique si la liste par defaut a ete utilisee.
- `missing_default_categories`: categories par defaut absentes apres filtrage.

### `summary`

```json
{
  "filtered_rows": 1281,
  "aggregated_rows_with_data": 108,
  "output_records": 108
}
```

- `filtered_rows`: nombre de lignes source apres application des filtres de l'extraction.
- `aggregated_rows_with_data`: nombre de combinaisons `annee x age x categorie` ayant des donnees.
- `output_records`: nombre total de blocs categorie exportes dans `values`.

## Structure de `values`

`values` est le coeur du JSON. Chaque noeud `values[annee][groupe_d_age]` contient:

1. trois pourcentages de repartition sociale
2. les categories d'activite exportees pour ce noeud

Exemple:

```json
{
  "2000": {
    "10-24": {
      "shared_pct": 24.947,
      "alone_pct": 74.001,
      "other_pct": 1.052,
      "AC01": {
        "average_minutes": 510.0,
        "observation_count": 1
      }
    }
  }
}
```

## Signification des champs dans un noeud `values[annee][groupe_d_age]`

| Champ | Type | Role |
| --- | --- | --- |
| `shared_pct` | `number` | Part des activites classees `shared`. |
| `alone_pct` | `number` | Part des activites classees `alone`. |
| `other_pct` | `number` | Part des activites classees `other`. |
| `ACxx...` | `object` | Bloc d'une categorie d'activite exportee. |

Pour chaque categorie exportee:

```json
"AC72": {
  "average_minutes": 24.0,
  "observation_count": 1
}
```

- `average_minutes`: moyenne des minutes pour cette categorie, cette annee et ce groupe d'age.
- `observation_count`: nombre de lignes source ayant servi a calculer cette moyenne.

## Calcul des pourcentages sociaux

Les champs `shared_pct`, `alone_pct` et `other_pct` sont calcules a partir de toutes les activites referencees dans [docs/observations-count-by-unified-acl-codes.md](/c:/Users/lenovo/Documents/APP5/VisualisationD/visualisation-app5/docs/observations-count-by-unified-acl-codes.md):

- toutes les activites marquees `shared` sont additionnees ensemble
- toutes les activites marquees `alone` sont additionnees ensemble
- toutes les activites marquees `other` sont additionnees ensemble
- toutes les activites marquees `none` sont ignorees

Les trois pourcentages sont normalises pour que:

```text
shared_pct + alone_pct + other_pct = 100.000
```

## Axes analytiques presents dans ce fichier

### Groupes d'age harmonises

| Groupe harmonise | Codes source utilises |
| --- | --- |
| `10-24` | `Y15-20`, `Y20-24`, `Y10-14`, `Y15-24`, `Y15-29` |
| `25-44` | `Y25-44`, `Y25-34`, `Y30-44`, `Y35-44` |
| `45-64` | `Y45-64`, `Y45-54`, `Y55-64` |
| `65+` | `Y65-74`, `Y_GE65`, `Y_GE75` |

### Categories d'activite exportees

- `AC01`
- `AC812`
- `AC72`
- `AC512_513_519`
- `AC52`
- `AC611`
- `AC321`
- `AC382_383`
- `AC910`

## Lecture rapide du fichier

Pour repondre a la question:

> Quel est le temps moyen passe en `AC72` pour le groupe `25-44` en `2020` ?

Il faut acceder a:

```text
values["2020"]["25-44"]["AC72"]
```

Pour recuperer la repartition sociale du meme noeud:

```text
values["2020"]["25-44"]["shared_pct"]
values["2020"]["25-44"]["alone_pct"]
values["2020"]["25-44"]["other_pct"]
```

## Resume

Ce JSON est maintenant organise autour de `values`, avec pour chaque `annee x groupe d'age`:

- une repartition sociale en pourcentage
- les statistiques des categories d'activite retenues

Le format est donc directement exploitable par un frontend qui doit afficher a la fois les categories detaillees et les parts `shared/alone/other`.