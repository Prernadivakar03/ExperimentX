"""add metrics table and event/conversion value column

Revision ID: e5f6a7b8c9d0
Revises: d4e5f6a7b8c9
Create Date: 2026-07-16 03:00:00.000000
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = 'e5f6a7b8c9d0'
down_revision = 'd4e5f6a7b8c9'
branch_labels = None
depends_on = None

metric_type_enum = postgresql.ENUM(
    'conversion_rate', 'count', 'sum', 'average', 'ratio', 'custom_formula',
    name='metrictype',
)


def upgrade() -> None:
    op.add_column('events', sa.Column('value', sa.Float(), nullable=True))
    op.add_column('conversions', sa.Column('value', sa.Float(), nullable=True))

    metric_type_enum.create(op.get_bind())
    op.create_table(
        'metrics',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('owner_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('key', sa.String(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('description', sa.String(), nullable=True),
        sa.Column('metric_type', metric_type_enum, nullable=False),
        sa.Column('event_type', sa.String(), nullable=True),
        sa.Column('numerator_event_type', sa.String(), nullable=True),
        sa.Column('denominator_event_type', sa.String(), nullable=True),
        sa.Column('formula', sa.String(), nullable=True),
        sa.Column('is_guardrail', sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column('created_at', sa.DateTime(), nullable=True),
    )


def downgrade() -> None:
    op.drop_table('metrics')
    metric_type_enum.drop(op.get_bind())
    op.drop_column('conversions', 'value')
    op.drop_column('events', 'value')