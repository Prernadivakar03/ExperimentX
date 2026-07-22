# backend/app/ml/train_conversion_model.py
"""
Conversion prediction: logistic regression baseline vs XGBoost, then SHAP
feature importance on the XGBoost model.

Run:
    cd backend
    python -m app.ml.train_conversion_model --experiment-id <uuid>
"""
import argparse
import joblib
import numpy as np
from sklearn.compose import ColumnTransformer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
import xgboost as xgb
import shap

from app.database import SessionLocal
from app.ml.features import build_feature_frame

CATEGORICAL = ["device", "browser", "country", "traffic_source", "variant"]
NUMERIC = ["session_duration_seconds", "page_views", "hour_of_day", "day_of_week"]
BOOLEAN = ["is_returning"]


def build_preprocessor():
    return ColumnTransformer([
        ("cat", OneHotEncoder(handle_unknown="ignore"), CATEGORICAL),
        ("num", StandardScaler(), NUMERIC),
    ], remainder="passthrough")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--experiment-id", required=True)
    args = parser.parse_args()

    db = SessionLocal()
    df = build_feature_frame(db, args.experiment_id)
    db.close()

    if df.empty or df["converted"].sum() < 20:
        print("Not enough data / conversions to train on. Run the synthetic generator first.")
        return

    df["is_returning"] = df["is_returning"].astype(int)
    X = df[CATEGORICAL + NUMERIC + BOOLEAN]
    y = df["converted"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, stratify=y, random_state=42
    )

    logreg = Pipeline([
        ("prep", build_preprocessor()),
        ("clf", LogisticRegression(max_iter=1000, class_weight="balanced")),
    ])
    logreg.fit(X_train, y_train)
    logreg_auc = roc_auc_score(y_test, logreg.predict_proba(X_test)[:, 1])
    print(f"Logistic regression ROC-AUC: {logreg_auc:.4f}")

    prep = build_preprocessor()
    X_train_enc = prep.fit_transform(X_train)
    X_test_enc = prep.transform(X_test)

    n_pos = y_train.sum()
    n_neg = len(y_train) - n_pos
    scale_pos_weight = n_neg / max(n_pos, 1)

    xgb_model = xgb.XGBClassifier(
        n_estimators=150, max_depth=4, learning_rate=0.08,
        scale_pos_weight=scale_pos_weight, eval_metric="auc", random_state=42,
    )
    xgb_model.fit(X_train_enc, y_train)
    xgb_auc = roc_auc_score(y_test, xgb_model.predict_proba(X_test_enc)[:, 1])
    print(f"XGBoost ROC-AUC: {xgb_auc:.4f}")

    print("\n--- Model comparison ---")
    print(f"Logistic regression: {logreg_auc:.4f} | XGBoost: {xgb_auc:.4f}")
    if xgb_auc - logreg_auc < 0.02:
        print("XGBoost barely beats the linear baseline — the relationships in this "
              "data are mostly additive. That's a legitimate finding: the added "
              "complexity of a tree ensemble isn't clearly justified here.")
    else:
        print("XGBoost meaningfully outperforms the linear baseline — there's real "
              "nonlinear/interaction structure (e.g. device x traffic_source) that "
              "the logistic model can't capture on its own.")

    feature_names = prep.get_feature_names_out()
    explainer = shap.TreeExplainer(xgb_model)
    shap_values = explainer.shap_values(X_test_enc)

    mean_abs_shap = np.abs(shap_values).mean(axis=0)
    importance = sorted(zip(feature_names, mean_abs_shap), key=lambda x: -x[1])[:10]
    print("\nTop 10 features by mean |SHAP value|:")
    for name, val in importance:
        print(f"  {name:35s} {val:.4f}")

    joblib.dump(
        {"model": xgb_model, "preprocessor": prep, "feature_names": list(feature_names)},
        "conversion_model.joblib",
    )
    print("\nSaved model to conversion_model.joblib")


if __name__ == "__main__":
    main()