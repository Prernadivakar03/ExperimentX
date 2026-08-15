
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.core.rbac import check_org_access
from app.core.webhooks import send_slack_alert, send_webhook
from app.models.organization import Organization, Membership, MemberRole
from app.schemas.organization_schema import (
    OrganizationCreate, OrganizationResponse, InviteMemberRequest,
    MembershipResponse, RoleUpdateRequest, WebhookSettingsUpdate, WebhookSettingsResponse, WebhookTestResponse,
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


# ── Webhook settings ─────────────────────────────────────────────────────────
# Outbound alerts (Slack-compatible incoming webhooks) fired on SRM detection,
# significance reached, and anomaly detection -- see app/core/webhooks.py for
# the actual delivery logic, and analytics.py for where these fire.

@router.get("/{org_id}/webhook", response_model=WebhookSettingsResponse)
def get_webhook_settings(
    org_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    check_org_access(org_id, current_user, db, MemberRole.viewer)
    org = db.query(Organization).filter(Organization.id == org_id).first()
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
    return org


@router.put("/{org_id}/webhook", response_model=WebhookSettingsResponse)
def update_webhook_settings(
    org_id: UUID,
    payload: WebhookSettingsUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    check_org_access(org_id, current_user, db, MemberRole.admin)
    org = db.query(Organization).filter(Organization.id == org_id).first()
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")

    org.webhook_url = payload.webhook_url or None
    org.webhook_events = payload.validated_events()
    db.commit()
    db.refresh(org)
    return org


@router.post("/{org_id}/webhook/test", response_model=WebhookTestResponse)
def test_webhook(
    org_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    check_org_access(org_id, current_user, db, MemberRole.admin)
    org = db.query(Organization).filter(Organization.id == org_id).first()
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")

    if not org.webhook_url:
        return WebhookTestResponse(success=False, message="No webhook URL configured yet")

    is_slack = "hooks.slack.com" in org.webhook_url
    if is_slack:
        ok = send_slack_alert(
            org.webhook_url, "significance_reached", "Test Experiment",
            f"👋 This is a test alert from {org.name} on ExperimentX. If you can see this, your webhook is wired up correctly.",
        )
    else:
        ok = send_webhook(
            org.webhook_url, "test",
            {"message": f"Test alert from {org.name} on ExperimentX"},
        )

    if ok:
        return WebhookTestResponse(success=True, message="Test alert sent — check your Slack/endpoint")
    return WebhookTestResponse(success=False, message="Delivery failed — check the URL and try again")

