"""add planned_duration_days and target_sample_size to experiments

Revision ID: a1b2c3d4e5f6
Revises: 3da6df394e1f
Create Date: 2026-07-16 00:00:00.000000
"""
from alembic import op
import sqlalchemy as sa

revision = 'a1b2c3d4e5f6'
down_revision = '3da6df394e1f'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('experiments', sa.Column('planned_duration_days', sa.Integer(), nullable=True))
    op.add_column('experiments', sa.Column('target_sample_size', sa.Integer(), nullable=True))


def downgrade() -> None:
    op.drop_column('experiments', 'target_sample_size')
    op.drop_column('experiments', 'planned_duration_days')











