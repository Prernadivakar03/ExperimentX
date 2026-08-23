"""add visitor user_id for identity stitching

Revision ID: b4c5d6e7f8a9
Revises: a3b4c5d6e7f8
Create Date: 2026-08-22 00:20:00.000000
"""
from alembic import op
import sqlalchemy as sa

revision = 'b4c5d6e7f8a9'
down_revision = 'a3b4c5d6e7f8'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('visitors', sa.Column('user_id', sa.String(), nullable=True))
    op.add_column('visitors', sa.Column('identified_at', sa.DateTime(), nullable=True))
    op.create_index('ix_visitors_user_id', 'visitors', ['user_id'])


def downgrade() -> None:
    op.drop_index('ix_visitors_user_id', table_name='visitors')
    op.drop_column('visitors', 'identified_at')
    op.drop_column('visitors', 'user_id')