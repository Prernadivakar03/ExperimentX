# backend/app/routes/ml.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from uuid import UUID

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.models.organization import MemberRole
from app.models.experiment import Experiment
from app.models.visitor import Visitor
from app.core.rbac import check_org_access
from app.ml.inference import (
    load_conversion_model, load_uplift_model,
    predict_conversion_probability, predict_uplift,
)

router = APIRouter(prefix="/ml", tags=["ml"])


class ModelStatus(BaseModel):
    conversion_model_trained: bool
    uplift_model_trained: bool
    conversion_roc_auc: float | None = None
    conversion_baseline_roc_auc: float | None = None
    top_features: list[dict] | None = None
    uplift_by_device: dict | None = None


def _get_experiment_authorized(experiment_id: UUID, user: User, db: Session) -> Experiment:
    experiment = db.query(Experiment).filter(Experiment.id == experiment_id).first()
    if not experiment:
        raise HTTPException(status_code=404, detail="Experiment not found")
    check_org_access(experiment.organization_id, user, db, minimum_role=MemberRole.viewer)
    return experiment


@router.get("/{experiment_id}/status", response_model=ModelStatus)
def get_model_status(
    experiment_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _get_experiment_authorized(experiment_id, current_user, db)

    conversion_artifact = load_conversion_model(str(experiment_id))
    uplift_artifact = load_uplift_model(str(experiment_id))

    return ModelStatus(
        conversion_model_trained=conversion_artifact is not None,
        uplift_model_trained=uplift_artifact is not None,
        conversion_roc_auc=conversion_artifact["roc_auc"] if conversion_artifact else None,
        conversion_baseline_roc_auc=conversion_artifact["logreg_roc_auc"] if conversion_artifact else None,
        top_features=conversion_artifact["top_features"] if conversion_artifact else None,
        uplift_by_device=uplift_artifact["uplift_by_device"] if uplift_artifact else None,
    )


@router.get("/{experiment_id}/visitors/{visitor_id}/predict")
def predict_for_visitor(
    experiment_id: UUID,
    visitor_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Prediction for a visitor already in the DB — for inspecting historical
    visitors in the dashboard, not a true real-time "visitor is on your
    site right now" prediction (that needs the real SDK sending partial-
    session features — see features.py's docstring for why).
    """
    experiment = _get_experiment_authorized(experiment_id, current_user, db)

    visitor = db.query(Visitor).filter(
        Visitor.id == visitor_id, Visitor.experiment_id == experiment_id,
    ).first()
    if not visitor:
        raise HTTPException(status_code=404, detail="Visitor not found")

    from app.models.variant import Variant
    from app.models.event import Event

    variant = db.query(Variant).filter(Variant.id == visitor.variant_id).first()
    page_views = db.query(Event).filter(
        Event.visitor_id == visitor.id, Event.event_type == "page_view",
    ).count()

    base_features = {
        "device": visitor.device or "unknown",
        "browser": visitor.browser or "unknown",
        "country": visitor.country or "unknown",
        "traffic_source": visitor.traffic_source or "unknown",
        "is_returning": int(bool(visitor.is_returning)),
        "session_duration_seconds": visitor.session_duration_seconds or 0,
        "page_views": page_views,
        "hour_of_day": visitor.created_at.hour,
        "day_of_week": visitor.created_at.weekday(),
    }

    conversion_prob = predict_conversion_probability(
        str(experiment_id), {**base_features, "variant": variant.label if variant else "unknown"},
    )
    uplift = predict_uplift(str(experiment_id), base_features)

    if conversion_prob is None and uplift is None:
        raise HTTPException(
            status_code=404,
            detail="No trained models found for this experiment yet — run the training scripts first.",
        )

    return {
        "visitor_id": str(visitor_id),
        "predicted_conversion_probability": conversion_prob,
        "predicted_uplift_of_variant_b": uplift,
        "note": (
            "Predictions are from models trained offline via the training scripts, "
            "not retrained live. Retrain periodically as more real data comes in."
        ),
    }