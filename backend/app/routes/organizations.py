# from fastapi import APIRouter, Depends, HTTPException, status
# from sqlalchemy.orm import Session
# from uuid import UUID
# from datetime import datetime

# from app.database import get_db
# from app.dependencies import get_current_user
# from app.models.user import User
# from app.models.organization import Organization, Membership, MemberRole
# from app.schemas.organization_schema import (
#     OrganizationCreate, OrganizationResponse, InviteMemberRequest,
#     MembershipResponse, RoleUpdateRequest,
# )

# router = APIRouter(prefix="/organizations", tags=["organizations"])


# @router.post("/", response_model=OrganizationResponse, status_code=status.HTTP_201_CREATED)
# def create_organization(
#     payload: OrganizationCreate,
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user),
# ):
#     org = Organization(name=payload.name, created_by=current_user.id)
#     db.add(org)
#     db.flush()

#     # creator is automatically an admin member
#     db.add(Membership(
#         organization_id=org.id, user_id=current_user.id,
#         role=MemberRole.admin, accepted_at=datetime.utcnow(),
#     ))
#     db.commit()
#     db.refresh(org)
#     return org


# @router.get("/", response_model=list[OrganizationResponse])
# def list_my_organizations(
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user),
# ):
#     memberships = db.query(Membership).filter(
#         Membership.user_id == current_user.id, Membership.accepted_at.isnot(None),
#     ).all()
#     org_ids = [m.organization_id for m in memberships]
#     return db.query(Organization).filter(Organization.id.in_(org_ids)).all()


# @router.get("/{org_id}/members", response_model=list[MembershipResponse])
# def list_members(
#     org_id: UUID,
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user),
# ):
#     # any accepted member (viewer+) can view the member list
#     caller_membership = db.query(Membership).filter(
#         Membership.organization_id == org_id,
#         Membership.user_id == current_user.id,
#         Membership.accepted_at.isnot(None),
#     ).first()
#     if not caller_membership:
#         raise HTTPException(status_code=403, detail="Not a member of this organization")

#     # Return all memberships (including pending invites if you want)
#     return db.query(Membership).filter(Membership.organization_id == org_id).all()


# @router.post("/{org_id}/invite", response_model=MembershipResponse, status_code=status.HTTP_201_CREATED)
# def invite_member(
#     org_id: UUID,
#     payload: InviteMemberRequest,
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user),
# ):
#     caller_membership = db.query(Membership).filter(
#         Membership.organization_id == org_id,
#         Membership.user_id == current_user.id,
#         Membership.role == MemberRole.admin,
#         Membership.accepted_at.isnot(None),
#     ).first()
#     if not caller_membership:
#         raise HTTPException(status_code=403, detail="Only admins can invite members")

#     existing = db.query(Membership).filter(
#         Membership.organization_id == org_id,
#         Membership.invited_email == payload.email,
#     ).first()
#     if existing:
#         raise HTTPException(status_code=409, detail="This email already has a pending or accepted invite")

#     invited_user = db.query(User).filter(User.email == payload.email).first()

#     membership = Membership(
#         organization_id=org_id,
#         user_id=invited_user.id if invited_user else None,
#         invited_email=payload.email,
#         role=payload.role,
#         accepted_at=datetime.utcnow() if invited_user else None,  # auto‑accept if they already have an account
#     )
#     # db.add(membership)
#     # db.commit()
#     # db.refresh(membership)

#     # # TODO: send an actual invite email here using your existing Resend integration
#     # # (same pattern as your welcome/password-reset emails)

#     # return membership

#     db.add(membership)
#     db.commit()
#     db.refresh(membership)

#     from app.core.email import send_invite_existing_user, send_invite_new_user
#     if invited_user:
#         send_invite_existing_user(payload.email, current_user.name, org.name)
#     else:
#         send_invite_new_user(payload.email, current_user.name, org.name)

#     return membership


# @router.patch("/{org_id}/members/{membership_id}/role", response_model=MembershipResponse)
# def update_member_role(
#     org_id: UUID,
#     membership_id: UUID,
#     payload: RoleUpdateRequest,
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user),
# ):
#     caller_membership = db.query(Membership).filter(
#         Membership.organization_id == org_id,
#         Membership.user_id == current_user.id,
#         Membership.role == MemberRole.admin,
#         Membership.accepted_at.isnot(None),
#     ).first()
#     if not caller_membership:
#         raise HTTPException(status_code=403, detail="Only admins can change roles")

#     target = db.query(Membership).filter(
#         Membership.id == membership_id,
#         Membership.organization_id == org_id,
#     ).first()
#     if not target:
#         raise HTTPException(status_code=404, detail="Membership not found")

#     target.role = payload.role
#     db.commit()
#     db.refresh(target)
#     return target


# @router.delete("/{org_id}/members/{membership_id}", status_code=status.HTTP_204_NO_CONTENT)
# def remove_member(
#     org_id: UUID,
#     membership_id: UUID,
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user),
# ):
#     caller_membership = db.query(Membership).filter(
#         Membership.organization_id == org_id,
#         Membership.user_id == current_user.id,
#         Membership.role == MemberRole.admin,
#         Membership.accepted_at.isnot(None),
#     ).first()
#     if not caller_membership:
#         raise HTTPException(status_code=403, detail="Only admins can remove members")

#     target = db.query(Membership).filter(
#         Membership.id == membership_id,
#         Membership.organization_id == org_id,
#     ).first()
#     if not target:
#         raise HTTPException(status_code=404, detail="Membership not found")

#     db.delete(target)
#     db.commit()











































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
    caller_membership = db.query(Membership).filter(
        Membership.organization_id == org_id,
        Membership.user_id == current_user.id,
        Membership.accepted_at.isnot(None),
    ).first()
    if not caller_membership:
        raise HTTPException(status_code=403, detail="Not a member of this organization")

    memberships = db.query(Membership).filter(Membership.organization_id == org_id).all()

    results = []
    for m in memberships:
        user_name = None
        user_email = m.invited_email
        if m.user_id:
            user = db.query(User).filter(User.id == m.user_id).first()
            if user:
                user_name = user.name
                user_email = user.email
        results.append({
            "id": m.id, "user_id": m.user_id, "invited_email": m.invited_email,
            "user_name": user_name, "user_email": user_email,
            "role": m.role, "accepted_at": m.accepted_at, "invited_at": m.invited_at,
        })
    return results


@router.post("/{org_id}/invite", response_model=MembershipResponse, status_code=status.HTTP_201_CREATED)
def invite_member(
    org_id: UUID,
    payload: InviteMemberRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Fetch organization early – needed later for email and validation
    org = db.query(Organization).filter(Organization.id == org_id).first()
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")

    # 1. Verify caller is an admin
    caller_membership = db.query(Membership).filter(
        Membership.organization_id == org_id,
        Membership.user_id == current_user.id,
        Membership.role == MemberRole.admin,
        Membership.accepted_at.isnot(None),
    ).first()
    if not caller_membership:
        raise HTTPException(status_code=403, detail="Only admins can invite members")

    # 2. Check for existing invite/membership
    existing = db.query(Membership).filter(
        Membership.organization_id == org_id,
        Membership.invited_email == payload.email,
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail="This email already has a pending or accepted invite")

    # 3. Check if invited email belongs to an existing user
    invited_user = db.query(User).filter(User.email == payload.email).first()

    # 4. Create membership record
    membership = Membership(
        organization_id=org_id,
        user_id=invited_user.id if invited_user else None,
        invited_email=payload.email,
        role=payload.role,
        accepted_at=datetime.utcnow() if invited_user else None,  # auto‑accept if user exists
    )
    db.add(membership)
    db.commit()
    db.refresh(membership)

    # 5. Prepare invitee details for response
    invitee_name = invited_user.name if invited_user else None
    invitee_email = invited_user.email if invited_user else payload.email

    # 6. Send the appropriate invitation email
    from app.core.email import send_invite_existing_user, send_invite_new_user
    if invited_user:
        send_invite_existing_user(payload.email, current_user.name, org.name)
    else:
        send_invite_new_user(payload.email, current_user.name, org.name)

    # Return a dict that includes user_name and user_email (similar to list_members)
    return {
        "id": membership.id,
        "user_id": membership.user_id,
        "invited_email": membership.invited_email,
        "user_name": invitee_name,
        "user_email": invitee_email,
        "role": membership.role,
        "accepted_at": membership.accepted_at,
        "invited_at": membership.invited_at,
    }


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