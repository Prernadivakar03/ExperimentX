"""visitor identity columns and assignment uniqueness

Revision ID: e99ec5bf65d6
Revises: 07e210d5de86
Create Date: 2026-08-24 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect

# revision identifiers, used by Alembic.
revision: str = 'e99ec5bf65d6'
down_revision: Union[str, Sequence[str], None] = '07e210d5de86'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    conn = op.get_bind()
    inspector = inspect(conn)
    existing_columns = {c["name"] for c in inspector.get_columns("visitors")}
    existing_constraints = {c["name"] for c in inspector.get_unique_constraints("visitors")}

    # Idempotent: only add what's actually missing. This migration failed
    # partway through on one machine before (user_id got added, then the
    # run crashed before the rest completed), so re-running it needs to
    # skip what's already there instead of erroring.
    if "user_id" not in existing_columns:
        op.add_column('visitors', sa.Column('user_id', sa.String(), nullable=True))

    if "identified_at" not in existing_columns:
        op.add_column('visitors', sa.Column('identified_at', sa.DateTime(), nullable=True))

    existing_indexes = {idx["name"] for idx in inspector.get_indexes("visitors")}
    if "ix_visitors_user_id" not in existing_indexes:
        op.create_index(op.f('ix_visitors_user_id'), 'visitors', ['user_id'], unique=False)

    if "uq_visitor_experiment_fingerprint" not in existing_constraints:
        # If you have pre-existing duplicate (experiment_id, fingerprint)
        # rows from before the race-condition fix, this step will fail.
        # Run this first if so, then re-run `alembic upgrade head`:
        #
        #   DELETE FROM visitors a USING visitors b
        #   WHERE a.id < b.id
        #     AND a.experiment_id = b.experiment_id
        #     AND a.fingerprint = b.fingerprint;
        op.create_unique_constraint(
            'uq_visitor_experiment_fingerprint',
            'visitors',
            ['experiment_id', 'fingerprint'],
        )


def downgrade() -> None:
    op.drop_constraint('uq_visitor_experiment_fingerprint', 'visitors', type_='unique')
    op.drop_index(op.f('ix_visitors_user_id'), table_name='visitors')
    op.drop_column('visitors', 'identified_at')
    op.drop_column('visitors', 'user_id')