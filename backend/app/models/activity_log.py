from sqlalchemy import Column, String, DateTime, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from app.database import Base


class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    experiment_id = Column(UUID(as_uuid=True), ForeignKey("experiments.id"), nullable=True, index=True)
    actor_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)

    action = Column(String, nullable=False)      # e.g. "experiment.created", "experiment.status_changed"
    details = Column(JSON, nullable=True)         # e.g. {"from": "draft", "to": "running"}

    timestamp = Column(DateTime, default=datetime.utcnow)

    experiment = relationship("Experiment")
    actor = relationship("User")