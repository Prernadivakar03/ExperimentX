from sqlalchemy import Column, String, DateTime, ForeignKey, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
import enum

from app.database import Base


class MemberRole(str, enum.Enum):
    admin = "admin"
    editor = "editor"
    viewer = "viewer"


class Organization(Base):
    __tablename__ = "organizations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    memberships = relationship("Membership", back_populates="organization", cascade="all, delete-orphan")


class Membership(Base):
    __tablename__ = "memberships"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)  # null until invite accepted
    invited_email = Column(String, nullable=True)  # set for pending invites before signup/acceptance

    role = Column(SAEnum(MemberRole), nullable=False, default=MemberRole.viewer)
    accepted_at = Column(DateTime, nullable=True)
    invited_at = Column(DateTime, default=datetime.utcnow)

    organization = relationship("Organization", back_populates="memberships")
    user = relationship("User")