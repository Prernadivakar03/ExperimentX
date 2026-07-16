import hashlib
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.models.holdout import HoldoutGroup, HoldoutVisitor, HoldoutConversion
from app.models.visitor import Visitor
from app.models.conversion import Conversion
from app.models.experiment import Experiment
from app.schemas.holdout_schema import (
    HoldoutGroupCreate, HoldoutGroupUpdate, HoldoutGroupResponse,
    HoldoutConversionRequest, HoldoutImpactResponse,
)

router = APIRouter(prefix="/holdout-groups", tags=["holdout"])


def _bucket(fingerprint: str, group_id) -> float:
    h = hashlib.md5(f"{fingerprint}:{group_id}".encode()).hexdigest()
    return (int(h, 16) % 10000) / 100.0  # 0.0 - 100.0


def check_holdout(owner_id: UUID, fingerprint: str, db: Session) -> HoldoutVisitor | None:
    """
    Call this from /assign BEFORE any experiment assignment.
    Returns a HoldoutVisitor row if the visitor should be excluded from
    ALL experiments for this owner, else None.
    """
    active_group = db.query(HoldoutGroup).filter(
        HoldoutGroup.owner_id == owner_id, HoldoutGroup.is_active == True,
    ).first()

    if not active_group:
        return None

    if _bucket(fingerprint, active_group.id) >= active_group.percentage:
        return None  # not in the holdout slice

    existing = db.query(HoldoutVisitor).filter(
        HoldoutVisitor.group_id == active_group.id,
        HoldoutVisitor.fingerprint == fingerprint,
    ).first()
    if existing:
        return existing

    hv = HoldoutVisitor(group_id=active_group.id, fingerprint=fingerprint)
    db.add(hv)
    db.commit()
    db.refresh(hv)
    return hv


@router.post("/", response_model=HoldoutGroupResponse, status_code=status.HTTP_201_CREATED)
def create_holdout_group(
    payload: HoldoutGroupCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing_active = db.query(HoldoutGroup).filter(
        HoldoutGroup.owner_id == current_user.id, HoldoutGroup.is_active == True,
    ).first()
    if existing_active:
        raise HTTPException(
            status_code=409,
            detail="An active holdout group already exists — deactivate it first (only one active holdout at a time keeps bucket math consistent)",
        )

    group = HoldoutGroup(owner_id=current_user.id, **payload.model_dump())
    db.add(group)
    db.commit()
    db.refresh(group)
    return group


@router.get("/", response_model=list[HoldoutGroupResponse])
def list_holdout_groups(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(HoldoutGroup).filter(HoldoutGroup.owner_id == current_user.id).all()


@router.patch("/{group_id}", response_model=HoldoutGroupResponse)
def update_holdout_group(
    group_id: UUID,
    payload: HoldoutGroupUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    group = db.query(HoldoutGroup).filter(
        HoldoutGroup.id == group_id, HoldoutGroup.owner_id == current_user.id,
    ).first()
    if not group:
        raise HTTPException(status_code=404, detail="Holdout group not found")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(group, field, value)

    db.commit()
    db.refresh(group)
    return group


# ── Public: called by SDK when a holdout visitor completes the goal event ───

@router.post("/track-conversion", status_code=status.HTTP_201_CREATED)
def track_holdout_conversion(
    payload: HoldoutConversionRequest,
    db: Session = Depends(get_db),
):
    active_group = db.query(HoldoutGroup).filter(
        HoldoutGroup.owner_id == payload.owner_id, HoldoutGroup.is_active == True,
    ).first()
    if not active_group:
        return {"message": "No active holdout group — nothing to track"}

    hv = db.query(HoldoutVisitor).filter(
        HoldoutVisitor.group_id == active_group.id,
        HoldoutVisitor.fingerprint == payload.fingerprint,
    ).first()
    if not hv:
        return {"message": "Visitor is not in the holdout group — nothing to track"}

    db.add(HoldoutConversion(holdout_visitor_id=hv.id, goal=payload.goal))
    db.commit()
    return {"message": "Holdout conversion tracked"}


# ── Impact analysis ──────────────────────────────────────────────────────────

@router.get("/{group_id}/impact", response_model=HoldoutImpactResponse)
def get_holdout_impact(
    group_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    group = db.query(HoldoutGroup).filter(
        HoldoutGroup.id == group_id, HoldoutGroup.owner_id == current_user.id,
    ).first()
    if not group:
        raise HTTPException(status_code=404, detail="Holdout group not found")

    holdout_visitor_ids = [
        hv.id for hv in db.query(HoldoutVisitor).filter(HoldoutVisitor.group_id == group_id).all()
    ]
    holdout_visitors = len(holdout_visitor_ids)
    holdout_conversions = db.query(HoldoutConversion).filter(
        HoldoutConversion.holdout_visitor_id.in_(holdout_visitor_ids)
    ).count() if holdout_visitor_ids else 0

    holdout_rate = round((holdout_conversions / holdout_visitors * 100), 2) if holdout_visitors else 0.0

    # Baseline = everyone who WAS exposed to an experiment, across all this owner's experiments
    experiment_ids = [e.id for e in db.query(Experiment).filter(Experiment.owner_id == current_user.id).all()]
    baseline_visitors = db.query(Visitor).filter(Visitor.experiment_id.in_(experiment_ids)).count() if experiment_ids else 0
    baseline_conversions = db.query(Conversion).filter(Conversion.experiment_id.in_(experiment_ids)).count() if experiment_ids else 0
    baseline_rate = round((baseline_conversions / baseline_visitors * 100), 2) if baseline_visitors else 0.0

    lift = None
    if holdout_rate > 0:
        lift = round((baseline_rate - holdout_rate) / holdout_rate * 100, 2)

    return HoldoutImpactResponse(
        holdout_visitors=holdout_visitors,
        holdout_conversions=holdout_conversions,
        holdout_conversion_rate=holdout_rate,
        baseline_visitors=baseline_visitors,
        baseline_conversions=baseline_conversions,
        baseline_conversion_rate=baseline_rate,
        estimated_lift_pct=lift,
        note=(
            "This compares the holdout population (never exposed to any experiment) against "
            "everyone who WAS in an experiment, across your whole account. It's a directional "
            "signal of your experimentation program's aggregate value, not a controlled test — "
            "treat it as approximate, especially with small holdout volume."
        ),
    )