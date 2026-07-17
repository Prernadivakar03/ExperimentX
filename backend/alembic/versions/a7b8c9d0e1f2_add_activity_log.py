"""add activity log table

Revision ID: a7b8c9d0e1f2
Revises: f6a7b8c9d0e1
Create Date: 2026-07-16 05:00:00.000000
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
from sqlalchemy import inspect

revision = 'a7b8c9d0e1f2'
down_revision = 'f6a7b8c9d0e1'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # 1. Check if the table already exists
    conn = op.get_bind()
    inspector = inspect(conn)
    if not inspector.has_table('activity_logs'):
        # 2. Create the table
        op.create_table(
            'activity_logs',
            sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
            sa.Column('experiment_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('experiments.id'), nullable=True),
            sa.Column('actor_user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=True),
            sa.Column('action', sa.String(), nullable=False),
            sa.Column('details', sa.JSON(), nullable=True),
            sa.Column('timestamp', sa.DateTime(), nullable=True),
        )
        # 3. Create the index
        op.create_index('ix_activity_logs_experiment_id', 'activity_logs', ['experiment_id'])
    # else: table exists, skip creation


def downgrade() -> None:
    # Only drop if the table exists (the migration may be downgraded only if it was actually created)
    conn = op.get_bind()
    inspector = inspect(conn)
    if inspector.has_table('activity_logs'):
        op.drop_index('ix_activity_logs_experiment_id', table_name='activity_logs')
        op.drop_table('activity_logs')