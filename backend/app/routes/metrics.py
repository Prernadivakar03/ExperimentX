# from fastapi import APIRouter, Depends, HTTPException, status
# from sqlalchemy.orm import Session
# from uuid import UUID

# from app.database import get_db
# from app.dependencies import get_current_user
# from app.models.user import User
# from app.models.metric import Metric, MetricType
# from app.models.experiment import Experiment
# from app.models.variant import Variant
# from app.models.visitor import Visitor
# from app.models.event import Event
# from app.models.conversion import Conversion
# from app.schemas.metric_schema import MetricCreate, MetricResponse, MetricValueResponse
# from app.core.formula_eval import evaluate_formula, FormulaError
# from sqlalchemy import func

# router = APIRouter(prefix="/metrics", tags=["metrics"])


# @router.post("/", response_model=MetricResponse, status_code=status.HTTP_201_CREATED)
# def create_metric(
#     payload: MetricCreate,
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user),
# ):
#     existing = db.query(Metric).filter(
#         Metric.owner_id == current_user.id, Metric.key == payload.key,
#     ).first()
#     if existing:
#         raise HTTPException(status_code=409, detail="A metric with this key already exists")

#     metric = Metric(owner_id=current_user.id, **payload.model_dump())
#     db.add(metric)
#     db.commit()
#     db.refresh(metric)
#     return metric


# @router.get("/", response_model=list[MetricResponse])
# def list_metrics(
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user),
# ):
#     return db.query(Metric).filter(Metric.owner_id == current_user.id).all()


# @router.delete("/{metric_id}", status_code=status.HTTP_204_NO_CONTENT)
# def delete_metric(
#     metric_id: UUID,
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user),
# ):
#     metric = db.query(Metric).filter(
#         Metric.id == metric_id, Metric.owner_id == current_user.id,
#     ).first()
#     if not metric:
#         raise HTTPException(status_code=404, detail="Metric not found")
#     db.delete(metric)
#     db.commit()


# @router.get("/{metric_id}/evaluate/{experiment_id}", response_model=list[MetricValueResponse])
# def evaluate_metric(
#     metric_id: UUID,
#     experiment_id: UUID,
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user),
# ):
#     """Computes this metric's value for EACH variant of the given experiment."""
#     metric = db.query(Metric).filter(
#         Metric.id == metric_id, Metric.owner_id == current_user.id,
#     ).first()
#     if not metric:
#         raise HTTPException(status_code=404, detail="Metric not found")

#     experiment = db.query(Experiment).filter(
#         Experiment.id == experiment_id, Experiment.owner_id == current_user.id,
#     ).first()
#     if not experiment:
#         raise HTTPException(status_code=404, detail="Experiment not found")

#     results = []
#     for variant in experiment.variants:
#         base = _compute_base_values(metric, experiment_id, variant.id, db)
#         value = _compute_metric_value(metric, base)
#         results.append(MetricValueResponse(
#             metric_key=metric.key, variant_label=variant.label, value=round(value, 4),
#         ))

#     return results


# def _compute_base_values(metric: Metric, experiment_id: UUID, variant_id: UUID, db: Session) -> dict:
#     visitors = db.query(Visitor).filter(
#         Visitor.experiment_id == experiment_id, Visitor.variant_id == variant_id,
#     ).count()

#     conversions = db.query(Conversion).filter(
#         Conversion.experiment_id == experiment_id, Conversion.variant_id == variant_id,
#     ).count()

#     event_count = 0
#     event_sum = 0.0
#     if metric.event_type:
#         event_count = db.query(Event).filter(
#             Event.experiment_id == experiment_id, Event.variant_id == variant_id,
#             Event.event_type == metric.event_type,
#         ).count()
#         event_sum = db.query(func.coalesce(func.sum(Event.value), 0.0)).filter(
#             Event.experiment_id == experiment_id, Event.variant_id == variant_id,
#             Event.event_type == metric.event_type,
#         ).scalar() or 0.0

#     numerator_count = 0
#     denominator_count = 0
#     if metric.numerator_event_type:
#         numerator_count = db.query(Event).filter(
#             Event.experiment_id == experiment_id, Event.variant_id == variant_id,
#             Event.event_type == metric.numerator_event_type,
#         ).count()
#     if metric.denominator_event_type:
#         denominator_count = db.query(Event).filter(
#             Event.experiment_id == experiment_id, Event.variant_id == variant_id,
#             Event.event_type == metric.denominator_event_type,
#         ).count()

#     return {
#         "visitors": visitors,
#         "conversions": conversions,
#         "event_count": event_count,
#         "event_sum": event_sum,
#         "numerator_count": numerator_count,
#         "denominator_count": denominator_count,
#     }


# def _compute_metric_value(metric: Metric, base: dict) -> float:
#     if metric.metric_type == MetricType.conversion_rate:
#         return (base["conversions"] / base["visitors"] * 100) if base["visitors"] else 0.0

#     if metric.metric_type == MetricType.count:
#         return float(base["event_count"])

#     if metric.metric_type == MetricType.sum:
#         return float(base["event_sum"])

#     if metric.metric_type == MetricType.average:
#         return (base["event_sum"] / base["event_count"]) if base["event_count"] else 0.0

#     if metric.metric_type == MetricType.ratio:
#         return (base["numerator_count"] / base["denominator_count"]) if base["denominator_count"] else 0.0

#     if metric.metric_type == MetricType.custom_formula:
#         try:
#             return evaluate_formula(metric.formula, base)
#         except FormulaError as e:
#             raise HTTPException(status_code=400, detail=f"Formula error: {e}")

#     return 0.0







































































# backend/app/routes/metrics.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.models.organization import MemberRole
from app.models.metric import Metric, MetricType
from app.models.experiment import Experiment
from app.models.variant import Variant
from app.models.visitor import Visitor
from app.models.event import Event
from app.models.conversion import Conversion
from app.core.rbac import check_org_access, get_primary_org_id
from app.schemas.metric_schema import MetricCreate, MetricResponse, MetricValueResponse
from app.core.formula_eval import evaluate_formula, FormulaError
from sqlalchemy import func

router = APIRouter(prefix="/metrics", tags=["metrics"])


@router.post("/", response_model=MetricResponse, status_code=status.HTTP_201_CREATED)
def create_metric(
    payload: MetricCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    org_id = get_primary_org_id(current_user, db)
    check_org_access(org_id, current_user, db, minimum_role=MemberRole.editor)

    existing = db.query(Metric).filter(
        Metric.organization_id == org_id, Metric.key == payload.key,
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail="A metric with this key already exists")

    metric = Metric(owner_id=current_user.id, organization_id=org_id, **payload.model_dump())
    db.add(metric)
    db.commit()
    db.refresh(metric)
    return metric


@router.get("/", response_model=list[MetricResponse])
def list_metrics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    from app.models.organization import Membership

    org_ids = [
        m.organization_id for m in
        db.query(Membership).filter(
            Membership.user_id == current_user.id,
            Membership.accepted_at.isnot(None),
        ).all()
    ]
    return db.query(Metric).filter(Metric.organization_id.in_(org_ids)).all()


@router.delete("/{metric_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_metric(
    metric_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    metric = db.query(Metric).filter(Metric.id == metric_id).first()
    if not metric:
        raise HTTPException(status_code=404, detail="Metric not found")
    check_org_access(metric.organization_id, current_user, db, minimum_role=MemberRole.admin)

    db.delete(metric)
    db.commit()


@router.get("/{metric_id}/evaluate/{experiment_id}", response_model=list[MetricValueResponse])
def evaluate_metric(
    metric_id: UUID,
    experiment_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Computes this metric's value for EACH variant of the given experiment."""
    metric = db.query(Metric).filter(Metric.id == metric_id).first()
    if not metric:
        raise HTTPException(status_code=404, detail="Metric not found")
    check_org_access(metric.organization_id, current_user, db, minimum_role=MemberRole.viewer)

    experiment = db.query(Experiment).filter(Experiment.id == experiment_id).first()
    if not experiment:
        raise HTTPException(status_code=404, detail="Experiment not found")
    check_org_access(experiment.organization_id, current_user, db, minimum_role=MemberRole.viewer)

    results = []
    for variant in experiment.variants:
        base = _compute_base_values(metric, experiment_id, variant.id, db)
        value = _compute_metric_value(metric, base)
        results.append(MetricValueResponse(
            metric_key=metric.key, variant_label=variant.label, value=round(value, 4),
        ))

    return results


def _compute_base_values(metric: Metric, experiment_id: UUID, variant_id: UUID, db: Session) -> dict:
    visitors = db.query(Visitor).filter(
        Visitor.experiment_id == experiment_id, Visitor.variant_id == variant_id,
    ).count()

    conversions = db.query(Conversion).filter(
        Conversion.experiment_id == experiment_id, Conversion.variant_id == variant_id,
    ).count()

    event_count = 0
    event_sum = 0.0
    if metric.event_type:
        event_count = db.query(Event).filter(
            Event.experiment_id == experiment_id, Event.variant_id == variant_id,
            Event.event_type == metric.event_type,
        ).count()
        event_sum = db.query(func.coalesce(func.sum(Event.value), 0.0)).filter(
            Event.experiment_id == experiment_id, Event.variant_id == variant_id,
            Event.event_type == metric.event_type,
        ).scalar() or 0.0

    numerator_count = 0
    denominator_count = 0
    if metric.numerator_event_type:
        numerator_count = db.query(Event).filter(
            Event.experiment_id == experiment_id, Event.variant_id == variant_id,
            Event.event_type == metric.numerator_event_type,
        ).count()
    if metric.denominator_event_type:
        denominator_count = db.query(Event).filter(
            Event.experiment_id == experiment_id, Event.variant_id == variant_id,
            Event.event_type == metric.denominator_event_type,
        ).count()

    return {
        "visitors": visitors,
        "conversions": conversions,
        "event_count": event_count,
        "event_sum": event_sum,
        "numerator_count": numerator_count,
        "denominator_count": denominator_count,
    }


def _compute_metric_value(metric: Metric, base: dict) -> float:
    if metric.metric_type == MetricType.conversion_rate:
        return (base["conversions"] / base["visitors"] * 100) if base["visitors"] else 0.0

    if metric.metric_type == MetricType.count:
        return float(base["event_count"])

    if metric.metric_type == MetricType.sum:
        return float(base["event_sum"])

    if metric.metric_type == MetricType.average:
        return (base["event_sum"] / base["event_count"]) if base["event_count"] else 0.0

    if metric.metric_type == MetricType.ratio:
        return (base["numerator_count"] / base["denominator_count"]) if base["denominator_count"] else 0.0

    if metric.metric_type == MetricType.custom_formula:
        try:
            return evaluate_formula(metric.formula, base)
        except FormulaError as e:
            raise HTTPException(status_code=400, detail=f"Formula error: {e}")

    return 0.0