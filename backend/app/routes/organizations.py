from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.models.organization import Organization, Membership, MemberRole
from app.schemas.organization_schema import (
    OrganizationCreate, OrganizationResponse, InviteMemberRequest,
    MembershipResponse, RoleUpdateRequest,
)

router = APIRouter(prefix="/organizations", tags=["organizations"])


@router.post("/", response_model=OrganizationResponse, status_code=status.HTTP_201_CREATED)
def create_organization(
    payload: OrganizationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    org = Organization(name=payload.name, created_by=current_user.id)
    db.add(org)
    db.flush()

    # creator is automatically an admin member
    db.add(Membership(
        organization_id=org.id, user_id=current_user.id,
        role=MemberRole.admin, accepted_at=datetime.utcnow(),
    ))
    db.commit()
    db.refresh(org)
    return org


@router.get("/", response_model=list[OrganizationResponse])
def list_my_organizations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    memberships = db.query(Membership).filter(
        Membership.user_id == current_user.id, Membership.accepted_at.isnot(None),
    ).all()
    org_ids = [m.organization_id for m in memberships]
    return db.query(Organization).filter(Organization.id.in_(org_ids)).all()


@router.get("/{org_id}/members", response_model=list[MembershipResponse])
def list_members(
    org_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # any accepted member (viewer+) can view the member list
    caller_membership = db.query(Membership).filter(
        Membership.organization_id == org_id,
        Membership.user_id == current_user.id,
        Membership.accepted_at.isnot(None),
    ).first()
    if not caller_membership:
        raise HTTPException(status_code=403, detail="Not a member of this organization")

    # Return all memberships (including pending invites if you want)
    return db.query(Membership).filter(Membership.organization_id == org_id).all()


@router.post("/{org_id}/invite", response_model=MembershipResponse, status_code=status.HTTP_201_CREATED)
def invite_member(
    org_id: UUID,
    payload: InviteMemberRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    caller_membership = db.query(Membership).filter(
        Membership.organization_id == org_id,
        Membership.user_id == current_user.id,
        Membership.role == MemberRole.admin,
        Membership.accepted_at.isnot(None),
    ).first()
    if not caller_membership:
        raise HTTPException(status_code=403, detail="Only admins can invite members")

    existing = db.query(Membership).filter(
        Membership.organization_id == org_id,
        Membership.invited_email == payload.email,
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail="This email already has a pending or accepted invite")

    invited_user = db.query(User).filter(User.email == payload.email).first()

    membership = Membership(
        organization_id=org_id,
        user_id=invited_user.id if invited_user else None,
        invited_email=payload.email,
        role=payload.role,
        accepted_at=datetime.utcnow() if invited_user else None,  # auto‑accept if they already have an account
    )
    db.add(membership)
    db.commit()
    db.refresh(membership)

    # TODO: send an actual invite email here using your existing Resend integration
    # (same pattern as your welcome/password-reset emails)

    return membership


@router.patch("/{org_id}/members/{membership_id}/role", response_model=MembershipResponse)
def update_member_role(
    org_id: UUID,
    membership_id: UUID,
    payload: RoleUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    caller_membership = db.query(Membership).filter(
        Membership.organization_id == org_id,
        Membership.user_id == current_user.id,
        Membership.role == MemberRole.admin,
        Membership.accepted_at.isnot(None),
    ).first()
    if not caller_membership:
        raise HTTPException(status_code=403, detail="Only admins can change roles")

    target = db.query(Membership).filter(
        Membership.id == membership_id,
        Membership.organization_id == org_id,
    ).first()
    if not target:
        raise HTTPException(status_code=404, detail="Membership not found")

    target.role = payload.role
    db.commit()
    db.refresh(target)
    return target


@router.delete("/{org_id}/members/{membership_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_member(
    org_id: UUID,
    membership_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    caller_membership = db.query(Membership).filter(
        Membership.organization_id == org_id,
        Membership.user_id == current_user.id,
        Membership.role == MemberRole.admin,
        Membership.accepted_at.isnot(None),
    ).first()
    if not caller_membership:
        raise HTTPException(status_code=403, detail="Only admins can remove members")

    target = db.query(Membership).filter(
        Membership.id == membership_id,
        Membership.organization_id == org_id,
    ).first()
    if not target:
        raise HTTPException(status_code=404, detail="Membership not found")

    db.delete(target)
    db.commit()