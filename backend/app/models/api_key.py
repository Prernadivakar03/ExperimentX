from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from app.database import Base


class ApiKey(Base):
    """
    Org-scoped API keys used by the client SDK to authenticate against the
    public tracking endpoints (/assign, /track-event, /track-conversion).

    Only the SHA-256 hash of the key is ever stored — the plaintext key is
    shown to the user exactly once, at creation time, and is not
    recoverable afterwards (same model as GitHub/Stripe API keys).
    """
    __tablename__ = "api_keys"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False, index=True)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)

    name = Column(String, nullable=False)  # user-facing label, e.g. "Production SDK"
    key_prefix = Column(String, nullable=False)  # e.g. "expx_live_ab12cd34" — shown in the UI so users can tell keys apart
    key_hash = Column(String, nullable=False, unique=True, index=True)  # sha256 hex digest of the full key

    created_at = Column(DateTime, default=datetime.utcnow)
    last_used_at = Column(DateTime, nullable=True)
    revoked_at = Column(DateTime, nullable=True)

    organization = relationship("Organization")
    creator = relationship("User")