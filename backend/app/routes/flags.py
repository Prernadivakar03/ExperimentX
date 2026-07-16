import hashlib
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.models.feature_flag import FeatureFlag
from app.schemas.flag_schema import (
    FlagCreate, FlagUpdate, FlagResponse, FlagEvaluationResponse,
)

router = APIRouter(prefix="/flags", tags=["flags"])


def _bucket(flag_key: str, visitor_fingerprint: str) -> int:
    """
    Deterministic 0-99 bucket for a given visitor + flag, same visitor always
    lands in the same bucket for a given flag (stable across rollout % changes).
    """
    h = hashlib.sha256(f"{flag_key}:{visitor_fingerprint}".encode()).hexdigest()
    return int(h[:8], 16) % 100


@router.post("/", response_model=FlagResponse, status_code=status.HTTP_201_CREATED)
def create_flag(
    payload: FlagCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing = db.query(FeatureFlag).filter(
        FeatureFlag.owner_id == current_user.id,
        FeatureFlag.key == payload.key,
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail="A flag with this key already exists")

    flag = FeatureFlag(owner_id=current_user.id, **payload.model_dump())
    db.add(flag)
    db.commit()
    db.refresh(flag)
    return flag


@router.get("/", response_model=list[FlagResponse])
def list_flags(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(FeatureFlag).filter(FeatureFlag.owner_id == current_user.id).all()


@router.patch("/{flag_id}", response_model=FlagResponse)
def update_flag(
    flag_id: UUID,
    payload: FlagUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    flag = db.query(FeatureFlag).filter(
        FeatureFlag.id == flag_id, FeatureFlag.owner_id == current_user.id,
    ).first()
    if not flag:
        raise HTTPException(status_code=404, detail="Flag not found")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(flag, field, value)

    db.commit()
    db.refresh(flag)
    return flag


@router.delete("/{flag_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_flag(
    flag_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    flag = db.query(FeatureFlag).filter(
        FeatureFlag.id == flag_id, FeatureFlag.owner_id == current_user.id,
    ).first()
    if not flag:
        raise HTTPException(status_code=404, detail="Flag not found")
    db.delete(flag)
    db.commit()


# ── Public evaluation endpoint — this is what your SDK snippet calls ────────

@router.get("/{key}/evaluate", response_model=FlagEvaluationResponse)
def evaluate_flag(
    key: str,
    fingerprint: str,
    owner_id: UUID,
    db: Session = Depends(get_db),
):
    """No auth required — this is called client-side by the SDK snippet,
    same trust model as your existing /assign endpoint."""
    flag = db.query(FeatureFlag).filter(
        FeatureFlag.key == key, FeatureFlag.owner_id == owner_id,
    ).first()

    if not flag:
        return {"key": key, "enabled": False, "reason": "Flag not found — defaulting to off"}

    if not flag.is_enabled:
        return {"key": key, "enabled": False, "reason": "Flag is disabled (kill switch)"}

    if flag.rollout_percentage >= 100:
        return {"key": key, "enabled": True, "reason": "100% rollout"}

    if flag.rollout_percentage <= 0:
        return {"key": key, "enabled": False, "reason": "0% rollout"}

    bucket = _bucket(key, fingerprint)
    enabled = bucket < flag.rollout_percentage
    return {
        "key": key,
        "enabled": enabled,
        "reason": f"Bucket {bucket} vs rollout {flag.rollout_percentage}%",
    }