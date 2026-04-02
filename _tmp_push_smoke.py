import glob
import importlib.util
import sys
from pathlib import Path
from unittest.mock import patch

module_path = Path("db-hf-normalization.py").resolve()
spec = importlib.util.spec_from_file_location("db_hf_normalization", module_path)
if spec is None or spec.loader is None:
    raise RuntimeError("Failed to load db-hf-normalization.py")
mod = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = mod
spec.loader.exec_module(mod)

obs_csvs = sorted(glob.glob("hf_export/intermediate/observations/*.csv"))[:1]
if not obs_csvs:
    raise RuntimeError("No observation CSV found under hf_export/intermediate/observations")

dataset_dict = mod.build_dataset_dict(
    [Path(x) for x in obs_csvs],
    Path("hf_export/intermediate/files.csv"),
    Path("hf_export/intermediate/metadata.csv"),
)
print("uniform_features=", mod.has_uniform_split_features(dataset_dict))

calls: list[tuple[str | None, str | None, bool | None]] = []


def fake_ds_push(self, *args, **kwargs):
    calls.append((kwargs.get("config_name"), kwargs.get("split"), kwargs.get("set_default")))
    return None


def fake_dd_push(self, *args, **kwargs):
    raise RuntimeError("DatasetDict.push_to_hub should not be called for mixed schemas")


with patch.object(type(dataset_dict), "push_to_hub", fake_dd_push), patch.object(
    type(dataset_dict["observations"]), "push_to_hub", fake_ds_push
):
    mod.push_dataset_dict_safely(dataset_dict, repo_id="dummy/repo", token="dummy", private=True)

print("calls=", calls)
