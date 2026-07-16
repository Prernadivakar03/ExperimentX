"""add experiment scheduling fields

Revision ID: f6a7b8c9d0e1
Revises: e5f6a7b8c9d0
Create Date: 2026-07-16 04:00:00.000000
"""
from alembic import op
import sqlalchemy as sa

revision = 'f6a7b8c9d0e1'
down_revision = 'e5f6a7b8c9d0'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('experiments', sa.Column('scheduled_start_at', sa.DateTime(), nullable=True))
    op.add_column('experiments', sa.Column('scheduled_end_at', sa.DateTime(), nullable=True))
    op.add_column('experiments', sa.Column('timezone', sa.String(), nullable=False, server_default='UTC'))


def downgrade() -> None:
    op.drop_column('experiments', 'timezone')
    op.drop_column('experiments', 'scheduled_end_at')
    op.drop_column('experiments', 'scheduled_start_at')