# backend/app/ml/train_uplift_model.py
"""
Uplift modeling — T-learner approach: train separate models on the
treatment (variant B) and control (variant A) populations, then predict
every visitor under BOTH conditions. uplift = P(convert|B) - P(convert|A).

This answers "who does variant B help", not just "does B help on average" —
the actual causal question an A/B test exists to answer, and the thing a
plain conversion-prediction model can't tell you.

Run:
    python -m app.ml.train_uplift_model --experiment-id <uuid>
"""
import argparse
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

from app.database import SessionLocal
from app.ml.features import build_feature_frame

CATEGORICAL = ["device", "browser", "country", "traffic_source"]
NUMERIC = ["session_duration_seconds", "page_views", "hour_of_day", "day_of_week"]
BOOLEAN = ["is_returning"]
FEATURES = CATEGORICAL + NUMERIC + BOOLEAN


def make_pipeline():
    prep = ColumnTransformer([
        ("cat", OneHotEncoder(handle_unknown="ignore"), CATEGORICAL),
        ("num", StandardScaler(), NUMERIC),
    ], remainder="passthrough")
    return Pipeline([
        ("prep", prep),
        ("clf", GradientBoostingClassifier(max_depth=3, n_estimators=100, random_state=42)),
    ])


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--experiment-id", required=True)
    args = parser.parse_args()

    db = SessionLocal()
    df = build_feature_frame(db, args.experiment_id)
    db.close()

    df["is_returning"] = df["is_returning"].astype(int)

    treated = df[df["variant"] == "B"]
    control = df[df["variant"] == "A"]

    if len(treated) < 100 or len(control) < 100:
        print("Not enough visitors per arm to train an uplift model reliably. "
              "Aim for at least a few hundred per arm.")
        return

    model_treated = make_pipeline()
    model_treated.fit(treated[FEATURES], treated["converted"])

    model_control = make_pipeline()
    model_control.fit(control[FEATURES], control["converted"])

    p_treated = model_treated.predict_proba(df[FEATURES])[:, 1]
    p_control = model_control.predict_proba(df[FEATURES])[:, 1]
    df["predicted_uplift"] = p_treated - p_control

    print("Average predicted uplift by device — this is the validation check.")
    print("The synthetic generator injected a strong effect on mobile and ~none")
    print("on desktop. If the model recovered that pattern, it's working:\n")
    print(df.groupby("device")["predicted_uplift"].mean().sort_values(ascending=False))

    print("\nTop 5 visitors by predicted uplift (best targets for variant B):")
    top = df.sort_values("predicted_uplift", ascending=False).head(5)
    print(top[["device", "traffic_source", "is_returning", "predicted_uplift"]].to_string(index=False))


if __name__ == "__main__":
    main()