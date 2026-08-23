"""add targeting_rules to feature_flags

Revision ID: e2f3a4b5c6d7
Revises: f1a2b3c4d5e6
Create Date: 2026-08-22 00:00:00.000000
"""
from alembic import op

revision = 'e2f3a4b5c6d7'
down_revision = 'f1a2b3c4d5e6'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        "ALTER TABLE feature_flags ADD COLUMN IF NOT EXISTS targeting_rules JSONB NOT NULL DEFAULT '[]';"
    )


def downgrade() -> None:
    op.execute("ALTER TABLE feature_flags DROP COLUMN IF EXISTS targeting_rules;")