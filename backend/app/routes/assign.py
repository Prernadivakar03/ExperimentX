
import hashlib
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID

from app.database import get_db
from app.models.experiment import Experiment, ExperimentStatus
from app.models.variant import Variant
from app.models.visitor import Visitor
from app.schemas.assign_schema import AssignRequest, AssignResponse

router = APIRouter(tags=["tracking"])


@router.post("/assign", response_model=AssignResponse)
def assign_variant(payload: AssignRequest, db: Session = Depends(get_db)):
    """
    Call this when a visitor lands on an experiment page.
    If the visitor (identified by fingerprint) has been seen before,
    return their existing assignment so they always see the same variant.
    If new, deterministically assign them using a hash so the split
    is stable and reproducible — not random each call.
    """

    # 1. Validate experiment exists and is running
    experiment = db.query(Experiment).filter(
        Experiment.id == payload.experiment_id,
        Experiment.status == ExperimentStatus.running,
    ).first()

    if not experiment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Experiment not found or not running",
        )

    # 2. Check if visitor already assigned
    existing = db.query(Visitor).filter(
        Visitor.experiment_id == payload.experiment_id,
        Visitor.fingerprint == payload.fingerprint,
    ).first()

    if existing:
        return AssignResponse(
            visitor_id=existing.id,
            variant_id=existing.variant_id,
            variant_label=existing.variant.label,
            variant_name=existing.variant.name,
            already_assigned=True,
        )

    # 3. Deterministic assignment via hash
    # Same fingerprint + experiment always maps to the same bucket
    hash_input = f"{payload.fingerprint}:{payload.experiment_id}"
    hash_int = int(hashlib.md5(hash_input.encode()).hexdigest(), 16)
    bucket = (hash_int % 10000) / 10000.0   # value between 0.0 and 1.0

    variants = (
        db.query(Variant)
        .filter(Variant.experiment_id == payload.experiment_id)
        .order_by(Variant.label)
        .all()
    )

    # Walk through variants, accumulate split, assign when bucket falls in range
    assigned_variant = None
    cumulative = 0.0
    for variant in variants:
        cumulative += variant.traffic_split
        if bucket < cumulative:
            assigned_variant = variant
            break

    # Fallback to last variant if float rounding misses
    if not assigned_variant:
        assigned_variant = variants[-1]

    # 4. Persist the assignment
    visitor = Visitor(
        experiment_id=payload.experiment_id,
        variant_id=assigned_variant.id,
        fingerprint=payload.fingerprint,
    )
    db.add(visitor)
    db.commit()
    db.refresh(visitor)

    return AssignResponse(
        visitor_id=visitor.id,
        variant_id=assigned_variant.id,
        variant_label=assigned_variant.label,
        variant_name=assigned_variant.name,
        already_assigned=False,
    )