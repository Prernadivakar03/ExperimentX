# backend/app/ml/inference.py
"""
Loads trained model artifacts for inference. Cached in memory per process —
fine for a single Railway instance; if you ever scale to multiple backend
instances, this cache won't be shared across them (each loads its own copy
from disk, which is still correct, just not memory-shared).
"""
import os
import joblib
from functools import lru_cache

ARTIFACT_DIR = "app/ml/artifacts"


@lru_cache(maxsize=32)
def load_conversion_model(experiment_id: str):
    path = f"{ARTIFACT_DIR}/{experiment_id}_conversion.joblib"
    if not os.path.exists(path):
        return None
    return joblib.load(path)


@lru_cache(maxsize=32)
def load_uplift_model(experiment_id: str):
    path = f"{ARTIFACT_DIR}/{experiment_id}_uplift.joblib"
    if not os.path.exists(path):
        return None
    return joblib.load(path)


def predict_conversion_probability(experiment_id: str, visitor_features: dict) -> float | None:
    artifact = load_conversion_model(experiment_id)
    if artifact is None:
        return None

    import pandas as pd
    row = pd.DataFrame([visitor_features])
    encoded = artifact["preprocessor"].transform(row)
    return float(artifact["model"].predict_proba(encoded)[:, 1][0])


def predict_uplift(experiment_id: str, visitor_features: dict) -> float | None:
    artifact = load_uplift_model(experiment_id)
    if artifact is None:
        return None

    import pandas as pd
    row = pd.DataFrame([visitor_features])[artifact["features"]]
    p_treated = artifact["model_treated"].predict_proba(row)[:, 1][0]
    p_control = artifact["model_control"].predict_proba(row)[:, 1][0]
    return float(p_treated - p_control)