from sqlalchemy.orm import Session
from uuid import UUID
from app.models.activity_log import ActivityLog


def log_activity(db: Session, actor_user_id: UUID, action: str, experiment_id: UUID | None = None, details: dict | None = None):
    entry = ActivityLog(
        actor_user_id=actor_user_id, action=action,
        experiment_id=experiment_id, details=details,
    )
    db.add(entry)
    db.commit()