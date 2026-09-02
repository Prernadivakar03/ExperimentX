"""activity_log actor_user_id nullable for system actions

Revision ID: 408050dcc94c
Revises: d070555d2c21
Create Date: 2026-08-28 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '408050dcc94c'
down_revision: Union[str, Sequence[str], None] = 'd070555d2c21'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Automated actions (e.g. the guardrail scheduler auto-pausing an
    # experiment) have no human actor to attribute the log entry to.
    # Without this, app/core/scheduler.py's guardrail-breach path crashes
    # with a NotNullViolation every single time it tries to fire --
    # meaning guardrails currently never actually auto-pause anything in
    # practice, they just fail silently and get swallowed by the
    # scheduler's exception handler.
    op.alter_column('activity_logs', 'actor_user_id', nullable=True)


def downgrade() -> None:
    op.alter_column('activity_logs', 'actor_user_id', nullable=False)