# backend/app/routes/guardrails.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.models.organization import MemberRole
from app.models.experiment import Experiment
from app.models.metric import Metric
from app.models.experiment_guardrail import ExperimentGuardrail
from app.core.rbac import check_org_access
from app.schemas.guardrail_schema import GuardrailCreate, GuardrailResponse

router = APIRouter(prefix="/experiments/{experiment_id}/guardrails", tags=["guardrails"])


def _get_experiment_or_404(experiment_id: UUID, db: Session) -> Experiment:
    experiment = db.query(Experiment).filter(Experiment.id == experiment_id).first()
    if not experiment:
        raise HTTPException(status_code=404, detail="Experiment not found")
    return experiment


def _to_response(guardrail: ExperimentGuardrail, metric: Metric) -> GuardrailResponse:
    return GuardrailResponse(
        id=guardrail.id,
        experiment_id=guardrail.experiment_id,
        metric_id=guardrail.metric_id,
        metric_key=metric.key,
        metric_name=metric.name,
        direction=guardrail.direction.value,
        max_regression_pct=guardrail.max_regression_pct,
        created_at=guardrail.created_at,
    )


@router.post("/", response_model=GuardrailResponse, status_code=status.HTTP_201_CREATED)
def add_guardrail(
    experiment_id: UUID,
    payload: GuardrailCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    experiment = _get_experiment_or_404(experiment_id, db)
    check_org_access(experiment.organization_id, current_user, db, minimum_role=MemberRole.editor)

    metric = db.query(Metric).filter(
        Metric.id == payload.metric_id, Metric.organization_id == experiment.organization_id,
    ).first()
    if not metric:
        raise HTTPException(status_code=404, detail="Metric not found in this organization")

    existing = db.query(ExperimentGuardrail).filter(
        ExperimentGuardrail.experiment_id == experiment_id,
        ExperimentGuardrail.metric_id == payload.metric_id,
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail="This metric is already a guardrail on this experiment")

    guardrail = ExperimentGuardrail(
        experiment_id=experiment_id,
        metric_id=payload.metric_id,
        direction=payload.direction,
        max_regression_pct=payload.max_regression_pct,
    )
    db.add(guardrail)
    db.commit()
    db.refresh(guardrail)
    return _to_response(guardrail, metric)


@router.get("/", response_model=list[GuardrailResponse])
def list_guardrails(
    experiment_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    experiment = _get_experiment_or_404(experiment_id, db)
    check_org_access(experiment.organization_id, current_user, db, minimum_role=MemberRole.viewer)

    guardrails = db.query(ExperimentGuardrail).filter(
        ExperimentGuardrail.experiment_id == experiment_id,
    ).all()
    return [_to_response(g, g.metric) for g in guardrails]


@router.delete("/{guardrail_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_guardrail(
    experiment_id: UUID,
    guardrail_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    experiment = _get_experiment_or_404(experiment_id, db)
    check_org_access(experiment.organization_id, current_user, db, minimum_role=MemberRole.editor)

    guardrail = db.query(ExperimentGuardrail).filter(
        ExperimentGuardrail.id == guardrail_id, ExperimentGuardrail.experiment_id == experiment_id,
    ).first()
    if not guardrail:
        raise HTTPException(status_code=404, detail="Guardrail not found")

    db.delete(guardrail)
    db.commit()