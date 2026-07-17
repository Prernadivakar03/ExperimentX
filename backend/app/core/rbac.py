"""
Role-checking dependency, used like:

    @router.post("/experiments")
    def create_experiment(
        org_id: UUID,
        current_user: User = Depends(get_current_user),
        _: Membership = Depends(require_role(org_id_param="org_id", minimum_role=MemberRole.editor)),
    ):
        ...

For now this is a standalone utility — NOT yet wired into your existing
experiments/flags/etc. routes, since those still use solo owner_id checks.
Wiring each route over to org-based permissions is the deliberate next step,
done one route at a time so nothing already-working breaks silently.
"""
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.models.organization import Membership, MemberRole

_ROLE_RANK = {MemberRole.viewer: 0, MemberRole.editor: 1, MemberRole.admin: 2}


def require_role(org_id: UUID, minimum_role: MemberRole):
    def _check(
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user),
    ) -> Membership:
        membership = db.query(Membership).filter(
            Membership.organization_id == org_id,
            Membership.user_id == current_user.id,
            Membership.accepted_at.isnot(None),
        ).first()

        if not membership:
            raise HTTPException(status_code=403, detail="Not a member of this organization")

        if _ROLE_RANK[membership.role] < _ROLE_RANK[minimum_role]:
            raise HTTPException(
                status_code=403,
                detail=f"Requires '{minimum_role.value}' role or higher, you have '{membership.role.value}'",
            )

        return membership

    return _check