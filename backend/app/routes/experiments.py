from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.models.experiment import Experiment, ExperimentStatus
from app.models.variant import Variant
from app.schemas.experiment_schema import (
    ExperimentCreate,
    ExperimentUpdate,
    ExperimentResponse,
)

router = APIRouter(prefix="/experiments", tags=["experiments"])


# ── Create ────────────────────────────────────────────────────────────────────

@router.post("/", response_model=ExperimentResponse, status_code=status.HTTP_201_CREATED)
def create_experiment(
    payload: ExperimentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    experiment = Experiment(
        owner_id=current_user.id,
        name=payload.name,
        description=payload.description,
        goal=payload.goal,
        status=ExperimentStatus.draft,
    )
    db.add(experiment)
    db.flush()  # get experiment.id before adding variants

    for v in payload.variants:
        variant = Variant(
            experiment_id=experiment.id,
            name=v.name,
            label=v.label,
            description=v.description,
            traffic_split=v.traffic_split,
        )
        db.add(variant)

    db.commit()
    db.refresh(experiment)
    return experiment


# ── List ──────────────────────────────────────────────────────────────────────

@router.get("/", response_model=list[ExperimentResponse])
def list_experiments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(Experiment)
        .filter(Experiment.owner_id == current_user.id)
        .order_by(Experiment.created_at.desc())
        .all()
    )


# ── Get one ───────────────────────────────────────────────────────────────────

@router.get("/{experiment_id}", response_model=ExperimentResponse)
def get_experiment(
    experiment_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    experiment = _get_owned(experiment_id, current_user, db)
    return experiment


# ── Update ────────────────────────────────────────────────────────────────────

@router.patch("/{experiment_id}", response_model=ExperimentResponse)
def update_experiment(
    experiment_id: UUID,
    payload: ExperimentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    experiment = _get_owned(experiment_id, current_user, db)

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(experiment, field, value)

    db.commit()
    db.refresh(experiment)
    return experiment


# ── Delete ────────────────────────────────────────────────────────────────────

@router.delete("/{experiment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_experiment(
    experiment_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    experiment = _get_owned(experiment_id, current_user, db)
    db.delete(experiment)
    db.commit()


# ── Helper ────────────────────────────────────────────────────────────────────

def _get_owned(experiment_id: UUID, user: User, db: Session) -> Experiment:
    experiment = db.query(Experiment).filter(
        Experiment.id == experiment_id,
        Experiment.owner_id == user.id,
    ).first()

    if not experiment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Experiment not found",
        )
    return experiment