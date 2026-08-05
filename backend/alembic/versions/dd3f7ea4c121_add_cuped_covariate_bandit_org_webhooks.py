"""add cuped covariate bandit org webhooks

Revision ID: dd3f7ea4c121
Revises: d0e1f2a3b4c5
Create Date: 2026-07-31 20:09:04.518953
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = 'dd3f7ea4c121'
down_revision: Union[str, Sequence[str], None] = 'd0e1f2a3b4c5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    conn = op.get_bind()

    # ── Clean up any legacy NULL rows before tightening constraints ──────
    # These tables predate several schema iterations — safer to check and
    # report than to blindly force NOT NULL and crash mid-migration.
    for table, cols in [
        ("conversions", ["experiment_id", "variant_id", "visitor_id", "goal"]),
        ("events", ["experiment_id", "variant_id", "visitor_id"]),
        ("visitors", ["experiment_id", "variant_id", "fingerprint"]),
    ]:
        for col in cols:
            result = conn.execute(sa.text(f"SELECT COUNT(*) FROM {table} WHERE {col} IS NULL")).scalar()
            if result > 0:
                print(f"WARNING: {table}.{col} has {result} NULL rows — deleting them "
                      f"(legacy/incomplete rows, not valid data under the current schema)")
                conn.execute(sa.text(f"DELETE FROM {table} WHERE {col} IS NULL"))

    op.alter_column('conversions', 'experiment_id', existing_type=sa.UUID(), nullable=False)
    op.alter_column('conversions', 'variant_id', existing_type=sa.UUID(), nullable=False)
    op.alter_column('conversions', 'visitor_id', existing_type=sa.UUID(), nullable=False)
    op.alter_column('conversions', 'goal', existing_type=sa.VARCHAR(), nullable=False)
    op.alter_column('events', 'experiment_id', existing_type=sa.UUID(), nullable=False)
    op.alter_column('events', 'variant_id', existing_type=sa.UUID(), nullable=False)
    op.alter_column('events', 'visitor_id', existing_type=sa.UUID(), nullable=False)

    # ── New columns: server_default backfills existing rows automatically ──
    op.add_column('experiments', sa.Column(
        'allocation_mode', sa.String(), nullable=False, server_default='fixed',
    ))
    op.add_column('organizations', sa.Column('webhook_url', sa.String(), nullable=True))
    op.add_column('organizations', sa.Column(
        'webhook_events', sa.JSON(), nullable=False, server_default='[]',
    ))
    op.add_column('visitors', sa.Column('pre_experiment_covariate', sa.Float(), nullable=True))

    op.alter_column('visitors', 'experiment_id', existing_type=sa.UUID(), nullable=False)
    op.alter_column('visitors', 'variant_id', existing_type=sa.UUID(), nullable=False)
    op.alter_column('visitors', 'fingerprint', existing_type=sa.VARCHAR(), nullable=False)


def downgrade() -> None:
    op.alter_column('visitors', 'fingerprint', existing_type=sa.VARCHAR(), nullable=True)
    op.alter_column('visitors', 'variant_id', existing_type=sa.UUID(), nullable=True)
    op.alter_column('visitors', 'experiment_id', existing_type=sa.UUID(), nullable=True)
    op.drop_column('visitors', 'pre_experiment_covariate')
    op.drop_column('organizations', 'webhook_events')
    op.drop_column('organizations', 'webhook_url')
    op.drop_column('experiments', 'allocation_mode')
    op.alter_column('events', 'visitor_id', existing_type=sa.UUID(), nullable=True)
    op.alter_column('events', 'variant_id', existing_type=sa.UUID(), nullable=True)
    op.alter_column('events', 'experiment_id', existing_type=sa.UUID(), nullable=True)
    op.alter_column('conversions', 'goal', existing_type=sa.VARCHAR(), nullable=True)
    op.alter_column('conversions', 'visitor_id', existing_type=sa.UUID(), nullable=True)
    op.alter_column('conversions', 'variant_id', existing_type=sa.UUID(), nullable=True)
    op.alter_column('conversions', 'experiment_id', existing_type=sa.UUID(), nullable=True)