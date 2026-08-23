
# # backend/app/routes/flags.py
# import hashlib
# from fastapi import APIRouter, Depends, HTTPException, status
# from sqlalchemy.orm import Session
# from uuid import UUID

# from app.database import get_db
# from app.dependencies import get_current_user
# from app.models.user import User
# from app.models.organization import MemberRole
# from app.models.feature_flag import FeatureFlag
# from app.core.rbac import check_org_access,  get_active_org_id
# from app.schemas.flag_schema import (
#     FlagCreate, FlagUpdate, FlagResponse, FlagEvaluationResponse,
# )



# router = APIRouter(prefix="/flags", tags=["flags"])


# def _bucket(flag_key: str, visitor_fingerprint: str) -> int:
#     """
#     Deterministic 0-99 bucket for a given visitor + flag, same visitor always
#     lands in the same bucket for a given flag (stable across rollout % changes).
#     """
#     h = hashlib.sha256(f"{flag_key}:{visitor_fingerprint}".encode()).hexdigest()
#     return int(h[:8], 16) % 100


# # @router.post("/", response_model=FlagResponse, status_code=status.HTTP_201_CREATED)
# # def create_flag(
# #     payload: FlagCreate,
# #     db: Session = Depends(get_db),
# #     current_user: User = Depends(get_current_user),
# # ):
# #     org_id = get_primary_org_id(current_user, db)
# #     check_org_access(org_id, current_user, db, minimum_role=MemberRole.editor)

# #     existing = db.query(FeatureFlag).filter(
# #         FeatureFlag.organization_id == org_id,
# #         FeatureFlag.key == payload.key,
# #     ).first()
# #     if existing:
# #         raise HTTPException(status_code=409, detail="A flag with this key already exists")

# #     flag = FeatureFlag(owner_id=current_user.id, organization_id=org_id, **payload.model_dump())
# #     db.add(flag)
# #     db.commit()
# #     db.refresh(flag)
# #     return flag


# # @router.get("/", response_model=list[FlagResponse])
# # def list_flags(
# #     db: Session = Depends(get_db),
# #     current_user: User = Depends(get_current_user),
# # ):
# #     from app.models.organization import Membership

# #     org_ids = [
# #         m.organization_id for m in
# #         db.query(Membership).filter(
# #             Membership.user_id == current_user.id,
# #             Membership.accepted_at.isnot(None),
# #         ).all()
# #     ]
# #     return db.query(FeatureFlag).filter(FeatureFlag.organization_id.in_(org_ids)).all()


# @router.post("/", response_model=FlagResponse, status_code=status.HTTP_201_CREATED)
# def create_flag(
#     payload: FlagCreate,
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user),
#     org_id: UUID = Depends(get_active_org_id),
# ):
#     check_org_access(org_id, current_user, db, minimum_role=MemberRole.editor)

#     existing = db.query(FeatureFlag).filter(
#         FeatureFlag.organization_id == org_id,
#         FeatureFlag.key == payload.key,
#     ).first()
#     if existing:
#         raise HTTPException(status_code=409, detail="A flag with this key already exists")

#     flag = FeatureFlag(owner_id=current_user.id, organization_id=org_id, **payload.model_dump())
#     db.add(flag)
#     db.commit()
#     db.refresh(flag)
#     return flag


# @router.get("/", response_model=list[FlagResponse])
# def list_flags(
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user),
#     org_id: UUID = Depends(get_active_org_id),
# ):
#     check_org_access(org_id, current_user, db, minimum_role=MemberRole.viewer)
#     return db.query(FeatureFlag).filter(FeatureFlag.organization_id == org_id).all()

# @router.patch("/{flag_id}", response_model=FlagResponse)
# def update_flag(
#     flag_id: UUID,
#     payload: FlagUpdate,
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user),
# ):
#     flag = db.query(FeatureFlag).filter(FeatureFlag.id == flag_id).first()
#     if not flag:
#         raise HTTPException(status_code=404, detail="Flag not found")
#     check_org_access(flag.organization_id, current_user, db, minimum_role=MemberRole.editor)

#     for field, value in payload.model_dump(exclude_unset=True).items():
#         setattr(flag, field, value)

#     db.commit()
#     db.refresh(flag)
#     return flag


# @router.delete("/{flag_id}", status_code=status.HTTP_204_NO_CONTENT)
# def delete_flag(
#     flag_id: UUID,
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user),
# ):
#     flag = db.query(FeatureFlag).filter(FeatureFlag.id == flag_id).first()
#     if not flag:
#         raise HTTPException(status_code=404, detail="Flag not found")
#     check_org_access(flag.organization_id, current_user, db, minimum_role=MemberRole.admin)

#     db.delete(flag)
#     db.commit()


# # ── Public evaluation endpoint — this is what your SDK snippet calls ────────
# # NOTE: still keyed by owner_id, not organization_id. Left unchanged
# # deliberately (see message above) — revisit when the real SDK ships.

# @router.get("/{key}/evaluate", response_model=FlagEvaluationResponse)
# def evaluate_flag(
#     key: str,
#     fingerprint: str,
#     owner_id: UUID,
#     db: Session = Depends(get_db),
# ):
#     """No auth required — this is called client-side by the SDK snippet,
#     same trust model as your existing /assign endpoint."""
#     flag = db.query(FeatureFlag).filter(
#         FeatureFlag.key == key, FeatureFlag.owner_id == owner_id,
#     ).first()

#     if not flag:
#         return {"key": key, "enabled": False, "reason": "Flag not found — defaulting to off"}

#     if not flag.is_enabled:
#         return {"key": key, "enabled": False, "reason": "Flag is disabled (kill switch)"}

#     if flag.rollout_percentage >= 100:
#         return {"key": key, "enabled": True, "reason": "100% rollout"}

#     if flag.rollout_percentage <= 0:
#         return {"key": key, "enabled": False, "reason": "0% rollout"}

#     bucket = _bucket(key, fingerprint)
#     enabled = bucket < flag.rollout_percentage
#     return {
#         "key": key,
#         "enabled": enabled,
#         "reason": f"Bucket {bucket} vs rollout {flag.rollout_percentage}%",
#     }





























# # backend/app/routes/flags.py
# import hashlib
# from fastapi import APIRouter, Depends, HTTPException, status
# from sqlalchemy.orm import Session
# from uuid import UUID

# from app.database import get_db
# from app.dependencies import get_current_user, get_org_from_api_key
# from app.models.user import User
# from app.models.organization import MemberRole, Organization
# from app.models.feature_flag import FeatureFlag
# from app.core.rbac import check_org_access,  get_active_org_id
# from app.core.limiter import rate_limit_by_ip
# from app.schemas.flag_schema import (
#     FlagCreate, FlagUpdate, FlagResponse, FlagEvaluationResponse,
# )



# router = APIRouter(prefix="/flags", tags=["flags"])


# def _bucket(flag_key: str, visitor_fingerprint: str) -> int:
#     """
#     Deterministic 0-99 bucket for a given visitor + flag, same visitor always
#     lands in the same bucket for a given flag (stable across rollout % changes).
#     """
#     h = hashlib.sha256(f"{flag_key}:{visitor_fingerprint}".encode()).hexdigest()
#     return int(h[:8], 16) % 100


# # @router.post("/", response_model=FlagResponse, status_code=status.HTTP_201_CREATED)
# # def create_flag(
# #     payload: FlagCreate,
# #     db: Session = Depends(get_db),
# #     current_user: User = Depends(get_current_user),
# # ):
# #     org_id = get_primary_org_id(current_user, db)
# #     check_org_access(org_id, current_user, db, minimum_role=MemberRole.editor)

# #     existing = db.query(FeatureFlag).filter(
# #         FeatureFlag.organization_id == org_id,
# #         FeatureFlag.key == payload.key,
# #     ).first()
# #     if existing:
# #         raise HTTPException(status_code=409, detail="A flag with this key already exists")

# #     flag = FeatureFlag(owner_id=current_user.id, organization_id=org_id, **payload.model_dump())
# #     db.add(flag)
# #     db.commit()
# #     db.refresh(flag)
# #     return flag


# # @router.get("/", response_model=list[FlagResponse])
# # def list_flags(
# #     db: Session = Depends(get_db),
# #     current_user: User = Depends(get_current_user),
# # ):
# #     from app.models.organization import Membership

# #     org_ids = [
# #         m.organization_id for m in
# #         db.query(Membership).filter(
# #             Membership.user_id == current_user.id,
# #             Membership.accepted_at.isnot(None),
# #         ).all()
# #     ]
# #     return db.query(FeatureFlag).filter(FeatureFlag.organization_id.in_(org_ids)).all()


# @router.post("/", response_model=FlagResponse, status_code=status.HTTP_201_CREATED)
# def create_flag(
#     payload: FlagCreate,
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user),
#     org_id: UUID = Depends(get_active_org_id),
# ):
#     check_org_access(org_id, current_user, db, minimum_role=MemberRole.editor)

#     existing = db.query(FeatureFlag).filter(
#         FeatureFlag.organization_id == org_id,
#         FeatureFlag.key == payload.key,
#     ).first()
#     if existing:
#         raise HTTPException(status_code=409, detail="A flag with this key already exists")

#     flag = FeatureFlag(owner_id=current_user.id, organization_id=org_id, **payload.model_dump())
#     db.add(flag)
#     db.commit()
#     db.refresh(flag)
#     return flag


# @router.get("/", response_model=list[FlagResponse])
# def list_flags(
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user),
#     org_id: UUID = Depends(get_active_org_id),
# ):
#     check_org_access(org_id, current_user, db, minimum_role=MemberRole.viewer)
#     return db.query(FeatureFlag).filter(FeatureFlag.organization_id == org_id).all()

# @router.patch("/{flag_id}", response_model=FlagResponse)
# def update_flag(
#     flag_id: UUID,
#     payload: FlagUpdate,
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user),
# ):
#     flag = db.query(FeatureFlag).filter(FeatureFlag.id == flag_id).first()
#     if not flag:
#         raise HTTPException(status_code=404, detail="Flag not found")
#     check_org_access(flag.organization_id, current_user, db, minimum_role=MemberRole.editor)

#     for field, value in payload.model_dump(exclude_unset=True).items():
#         setattr(flag, field, value)

#     db.commit()
#     db.refresh(flag)
#     return flag


# @router.delete("/{flag_id}", status_code=status.HTTP_204_NO_CONTENT)
# def delete_flag(
#     flag_id: UUID,
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user),
# ):
#     flag = db.query(FeatureFlag).filter(FeatureFlag.id == flag_id).first()
#     if not flag:
#         raise HTTPException(status_code=404, detail="Flag not found")
#     check_org_access(flag.organization_id, current_user, db, minimum_role=MemberRole.admin)

#     db.delete(flag)
#     db.commit()


# # ── Public evaluation endpoint — this is what the SDK calls ─────────────────
# # Gated behind X-API-Key (same as /assign, /track-event, /track-conversion)
# # and keyed by the authenticated organization rather than a client-supplied
# # owner_id. The previous version accepted any owner_id UUID with zero auth,
# # which let anyone who guessed/enumerated a UUID read another org's flag
# # state -- this closes that gap.

# @router.get("/{key}/evaluate", response_model=FlagEvaluationResponse)
# def evaluate_flag(
#     key: str,
#     fingerprint: str,
#     db: Session = Depends(get_db),
#     _rl=Depends(rate_limit_by_ip("60/minute")),
#     organization: Organization = Depends(get_org_from_api_key),
# ):
#     flag = db.query(FeatureFlag).filter(
#         FeatureFlag.key == key, FeatureFlag.organization_id == organization.id,
#     ).first()

#     if not flag:
#         return {"key": key, "enabled": False, "reason": "Flag not found — defaulting to off"}

#     if not flag.is_enabled:
#         return {"key": key, "enabled": False, "reason": "Flag is disabled (kill switch)"}

#     if flag.rollout_percentage >= 100:
#         return {"key": key, "enabled": True, "reason": "100% rollout"}

#     if flag.rollout_percentage <= 0:
#         return {"key": key, "enabled": False, "reason": "0% rollout"}

#     bucket = _bucket(key, fingerprint)
#     enabled = bucket < flag.rollout_percentage
#     return {
#         "key": key,
#         "enabled": enabled,
#         "reason": f"Bucket {bucket} vs rollout {flag.rollout_percentage}%",
#     }







































# backend/app/routes/flags.py
import hashlib
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from uuid import UUID

from app.database import get_db
from app.dependencies import get_current_user, get_org_from_api_key
from app.models.user import User
from app.models.organization import MemberRole, Organization
from app.models.feature_flag import FeatureFlag
from app.core.rbac import check_org_access,  get_active_org_id
from app.core.limiter import rate_limit_by_ip
from app.schemas.flag_schema import (
    FlagCreate, FlagUpdate, FlagResponse, FlagEvaluationResponse,
)
from app.core.geoip import get_country_from_ip, get_client_ip
from app.core.targeting import evaluate_targeting_rules


router = APIRouter(prefix="/flags", tags=["flags"])


def _bucket(flag_key: str, visitor_fingerprint: str) -> int:
    """
    Deterministic 0-99 bucket for a given visitor + flag, same visitor always
    lands in the same bucket for a given flag (stable across rollout % changes).
    """
    h = hashlib.sha256(f"{flag_key}:{visitor_fingerprint}".encode()).hexdigest()
    return int(h[:8], 16) % 100


# @router.post("/", response_model=FlagResponse, status_code=status.HTTP_201_CREATED)
# def create_flag(
#     payload: FlagCreate,
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user),
# ):
#     org_id = get_primary_org_id(current_user, db)
#     check_org_access(org_id, current_user, db, minimum_role=MemberRole.editor)

#     existing = db.query(FeatureFlag).filter(
#         FeatureFlag.organization_id == org_id,
#         FeatureFlag.key == payload.key,
#     ).first()
#     if existing:
#         raise HTTPException(status_code=409, detail="A flag with this key already exists")

#     flag = FeatureFlag(owner_id=current_user.id, organization_id=org_id, **payload.model_dump())
#     db.add(flag)
#     db.commit()
#     db.refresh(flag)
#     return flag


# @router.get("/", response_model=list[FlagResponse])
# def list_flags(
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user),
# ):
#     from app.models.organization import Membership

#     org_ids = [
#         m.organization_id for m in
#         db.query(Membership).filter(
#             Membership.user_id == current_user.id,
#             Membership.accepted_at.isnot(None),
#         ).all()
#     ]
#     return db.query(FeatureFlag).filter(FeatureFlag.organization_id.in_(org_ids)).all()


@router.post("/", response_model=FlagResponse, status_code=status.HTTP_201_CREATED)
def create_flag(
    payload: FlagCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    org_id: UUID = Depends(get_active_org_id),
):
    check_org_access(org_id, current_user, db, minimum_role=MemberRole.editor)

    existing = db.query(FeatureFlag).filter(
        FeatureFlag.organization_id == org_id,
        FeatureFlag.key == payload.key,
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail="A flag with this key already exists")

    flag = FeatureFlag(owner_id=current_user.id, organization_id=org_id, **payload.model_dump())
    db.add(flag)
    db.commit()
    db.refresh(flag)
    return flag


@router.get("/", response_model=list[FlagResponse])
def list_flags(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    org_id: UUID = Depends(get_active_org_id),
):
    check_org_access(org_id, current_user, db, minimum_role=MemberRole.viewer)
    return db.query(FeatureFlag).filter(FeatureFlag.organization_id == org_id).all()


@router.patch("/{flag_id}", response_model=FlagResponse)
def update_flag(
    flag_id: UUID,
    payload: FlagUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    flag = db.query(FeatureFlag).filter(FeatureFlag.id == flag_id).first()
    if not flag:
        raise HTTPException(status_code=404, detail="Flag not found")
    check_org_access(flag.organization_id, current_user, db, minimum_role=MemberRole.editor)

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
    flag = db.query(FeatureFlag).filter(FeatureFlag.id == flag_id).first()
    if not flag:
        raise HTTPException(status_code=404, detail="Flag not found")
    check_org_access(flag.organization_id, current_user, db, minimum_role=MemberRole.admin)

    db.delete(flag)
    db.commit()


# ── Public evaluation endpoint — this is what the SDK calls ─────────────────
# Gated behind X-API-Key (same as /assign, /track-event, /track-conversion)
# and keyed by the authenticated organization rather than a client-supplied
# owner_id. The previous version accepted any owner_id UUID with zero auth,
# which let anyone who guessed/enumerated a UUID read another org's flag
# state -- this closes that gap.

@router.get("/{key}/evaluate", response_model=FlagEvaluationResponse)
def evaluate_flag(
    key: str,
    fingerprint: str,
    request: Request,
    db: Session = Depends(get_db),
    _rl=Depends(rate_limit_by_ip("60/minute")),
    organization: Organization = Depends(get_org_from_api_key),
):
    flag = db.query(FeatureFlag).filter(
        FeatureFlag.key == key, FeatureFlag.organization_id == organization.id,
    ).first()

    if not flag:
        return {"key": key, "enabled": False, "reason": "Flag not found — defaulting to off"}

    if not flag.is_enabled:
        return {"key": key, "enabled": False, "reason": "Flag is disabled (kill switch)"}

    # Targeting context: country is always server-derived from IP (never
    # trust a client-supplied country), everything else is whatever the
    # SDK passed as query params (device, url_path, plan, or any custom key).
    context = {k: v for k, v in request.query_params.items() if k != "fingerprint"}
    context["country"] = get_country_from_ip(get_client_ip(request))

    rule_enabled, rule_reason = evaluate_targeting_rules(
        flag_key=key,
        rules=flag.targeting_rules or [],
        context=context,
        fingerprint=fingerprint,
    )
    if rule_reason is not None:
        return {"key": key, "enabled": rule_enabled, "reason": rule_reason}

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