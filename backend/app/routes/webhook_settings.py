from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.models.organization import Organization, MemberRole
from app.core.rbac import check_org_access
from app.core.webhooks import send_slack_alert
from app.schemas.organization_schema import WebhookSettingsResponse, WebhookSettingsUpdate

router = APIRouter(prefix="/organizations/{org_id}", tags=["webhooks"])


def _get_org_or_404(org_id: UUID, db: Session) -> Organization:
    org = db.query(Organization).filter(Organization.id == org_id).first()
    if not org:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Organization not found")
    return org


@router.get("/webhook", response_model=WebhookSettingsResponse)
def get_webhook_settings(
    org_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    check_org_access(org_id, current_user, db, MemberRole.viewer)
    return _get_org_or_404(org_id, db)


@router.put("/webhook", response_model=WebhookSettingsResponse)
def update_webhook_settings(
    org_id: UUID,
    payload: WebhookSettingsUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    check_org_access(org_id, current_user, db, MemberRole.admin)
    org = _get_org_or_404(org_id, db)

    org.webhook_url = payload.webhook_url
    org.webhook_events = payload.webhook_events
    db.commit()
    db.refresh(org)
    return org


@router.post("/webhook/test", status_code=status.HTTP_200_OK)
def test_webhook(
    org_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    check_org_access(org_id, current_user, db, MemberRole.admin)
    org = _get_org_or_404(org_id, db)

    if not org.webhook_url:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No webhook URL configured for this organization",
        )

    ok = send_slack_alert(
        org.webhook_url,
        "test",
        "Test Experiment",
        "This is a test alert from ExperimentX — your webhook is working.",
    )
    if not ok:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Webhook delivery failed — check the URL and try again",
        )
    return {"success": True}