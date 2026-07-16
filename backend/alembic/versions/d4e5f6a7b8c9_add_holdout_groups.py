"""add holdout groups

Revision ID: d4e5f6a7b8c9
Revises: c3d4e5f6a7b8
Create Date: 2026-07-16 02:00:00.000000
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = 'd4e5f6a7b8c9'
down_revision = 'c3d4e5f6a7b8'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'holdout_groups',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('owner_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('description', sa.String(), nullable=True),
        sa.Column('percentage', sa.Integer(), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column('created_at', sa.DateTime(), nullable=True),
    )
    op.create_table(
        'holdout_visitors',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('group_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('holdout_groups.id'), nullable=False),
        sa.Column('fingerprint', sa.String(), nullable=False, index=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
    )
    op.create_unique_constraint(
        'uq_holdout_group_fingerprint', 'holdout_visitors', ['group_id', 'fingerprint']
    )
    op.create_table(
        'holdout_conversions',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('holdout_visitor_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('holdout_visitors.id'), nullable=False),
        sa.Column('goal', sa.String(), nullable=False),
        sa.Column('timestamp', sa.DateTime(), nullable=True),
    )


def downgrade() -> None:
    op.drop_table('holdout_conversions')
    op.drop_table('holdout_visitors')
    op.drop_table('holdout_groups')