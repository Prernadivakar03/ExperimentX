# backend/app/core/rbac.py
"""
Organization-based access control.

Two ways to use this:

1. As a route dependency, when organization_id IS a path parameter
   (e.g. /organizations/{org_id}/members):

    @router.get("/{org_id}/members")
    def list_members(
        org_id: UUID,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user),
        _membership: Membership = Depends(require_role(MemberRole.viewer)),
    ):
        ...

   FastAPI binds `org_id` from the path automatically because the inner
   function's parameter name matches the path parameter name.

2. As a plain function call, when you already have a resource loaded
   (experiment, flag, metric, etc.) and need to check ITS organization_id
   against the current user. This is the common case for resource-owned
   routes like /experiments/{id}:

    membership = check_org_access(experiment.organization_id, current_user, db, MemberRole.editor)
"""
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from typing import Optional

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.models.organization import Membership, MemberRole

_ROLE_RANK = {MemberRole.viewer: 0, MemberRole.editor: 1, MemberRole.admin: 2}


def check_org_access(
    organization_id: Optional[UUID],
    user: User,
    db: Session,
    minimum_role: MemberRole = MemberRole.viewer,
) -> Membership:
    """Raise 403 if the user isn't a member of the org with at least `minimum_role`."""
    if organization_id is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Resource has no organization assigned",
        )

    membership = db.query(Membership).filter(
        Membership.organization_id == organization_id,
        Membership.user_id == user.id,
        Membership.accepted_at.isnot(None),
    ).first()

    if not membership:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not a member of this organization",
        )

    if _ROLE_RANK[membership.role] < _ROLE_RANK[minimum_role]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Requires '{minimum_role.value}' role or higher, you have '{membership.role.value}'",
        )

    return membership


def get_primary_org_id(user: User, db: Session) -> UUID:
    """
    Every user gets a personal organization automatically on signup (see
    auth.py). This returns the oldest org they're an accepted member of —
    used as the default organization_id when creating resources, until the
    frontend has a proper org switcher for users who belong to more than one.
    """
    membership = (
        db.query(Membership)
        .filter(Membership.user_id == user.id, Membership.accepted_at.isnot(None))
        .order_by(Membership.invited_at.asc())
        .first()
    )
    if not membership:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="User has no organization. Run the organization backfill migration.",
        )
    return membership.organization_id


def require_role(minimum_role: MemberRole):
    """Dependency factory for routes where {org_id} is a path parameter."""
    def _check(
        org_id: UUID,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user),
    ) -> Membership:
        return check_org_access(org_id, current_user, db, minimum_role)

    return _check