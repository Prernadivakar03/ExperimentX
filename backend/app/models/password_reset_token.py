# backend/app/models/password_reset_token.py
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from app.database import Base


class PasswordResetToken(Base):
    """
    A single-use, short-lived token for the forgot-password flow.

    We never store the raw token — only its sha256 hash — the same pattern
    used for API keys. The raw token only ever exists in the email link and
    briefly in memory on this server; if the DB were ever leaked, the
    stored hashes are useless to an attacker without the raw value.
    """
    __tablename__ = "password_reset_tokens"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )

    token_hash = Column(String, nullable=False, unique=True, index=True)
    expires_at = Column(DateTime, nullable=False)
    used_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User")