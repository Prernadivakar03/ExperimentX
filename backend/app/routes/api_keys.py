# backend/app/routes/api_keys.py
"""
Manage org-scoped API keys used by the client SDK to call the public
tracking endpoints (/assign, /track-event, /track-conversion).

Creating and revoking keys is admin-only — a leaked/rotated key affects
every visitor hitting the SDK for that org, so this isn't an editor-level
action. Listing keys is viewer+ (masked — no full key is ever returned
after creation).
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.models.api_key import ApiKey
from app.models.organization import MemberRole
from app.core.api_keys import generate_api_key
from app.core.rbac import check_org_access
from app.schemas.api_key_schema import ApiKeyCreate, ApiKeyCreateResponse, ApiKeyResponse

router = APIRouter(prefix="/organizations/{org_id}/api-keys", tags=["api-keys"])


@router.post("/", response_model=ApiKeyCreateResponse, status_code=status.HTTP_201_CREATED)
def create_api_key(
    org_id: UUID,
    payload: ApiKeyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    check_org_access(org_id, current_user, db, MemberRole.admin)

    generated = generate_api_key()
    record = ApiKey(
        organization_id=org_id,
        created_by=current_user.id,
        name=payload.name,
        key_prefix=generated["display_prefix"],
        key_hash=generated["key_hash"],
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    # full_key is only ever available here, right after generation --
    # it's never derivable from key_hash and is not stored in plaintext.
    return ApiKeyCreateResponse(
        id=record.id,
        name=record.name,
        full_key=generated["full_key"],
        key_prefix=record.key_prefix,
        created_at=record.created_at,
    )


@router.get("/", response_model=list[ApiKeyResponse])
def list_api_keys(
    org_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    check_org_access(org_id, current_user, db, MemberRole.viewer)

    return db.query(ApiKey).filter(
        ApiKey.organization_id == org_id,
    ).order_by(ApiKey.created_at.desc()).all()


@router.delete("/{key_id}", status_code=status.HTTP_200_OK)
def revoke_api_key(
    org_id: UUID,
    key_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    check_org_access(org_id, current_user, db, MemberRole.admin)

    record = db.query(ApiKey).filter(
        ApiKey.id == key_id,
        ApiKey.organization_id == org_id,
    ).first()

    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="API key not found")

    if record.revoked_at is not None:
        return {"message": "Key already revoked"}

    record.revoked_at = datetime.utcnow()
    db.commit()

    return {"message": "API key revoked"}