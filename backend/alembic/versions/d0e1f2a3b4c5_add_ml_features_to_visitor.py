# backend/alembic/versions/d0e1f2a3b4c5_add_ml_features_to_visitor.py
"""add ml feature columns to visitor

Revision ID: d0e1f2a3b4c5
Revises: c9d0e1f2a3b4
Create Date: 2026-07-22
"""
from alembic import op
import sqlalchemy as sa

revision = 'd0e1f2a3b4c5'
down_revision = 'c9d0e1f2a3b4'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('visitors', sa.Column('device', sa.String(), nullable=True))
    op.add_column('visitors', sa.Column('browser', sa.String(), nullable=True))
    op.add_column('visitors', sa.Column('country', sa.String(), nullable=True))
    op.add_column('visitors', sa.Column('traffic_source', sa.String(), nullable=True))
    op.add_column('visitors', sa.Column('is_returning', sa.Boolean(), nullable=True))
    op.add_column('visitors', sa.Column('session_duration_seconds', sa.Integer(), nullable=True))


def downgrade():
    op.drop_column('visitors', 'session_duration_seconds')
    op.drop_column('visitors', 'is_returning')
    op.drop_column('visitors', 'traffic_source')
    op.drop_column('visitors', 'country')
    op.drop_column('visitors', 'browser')
    op.drop_column('visitors', 'device')