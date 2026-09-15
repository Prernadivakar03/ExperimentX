"""conversion uniqueness

Revision ID: f1a2b3c4d5e6
Revises: a1c9f3e2b7d4
Create Date: 2026-09-16 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'f1a2b3c4d5e6'
down_revision: Union[str, Sequence[str], None] = 'a1c9f3e2b7d4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Mirrors the application-level dedupe check in event.py's
    # track_conversion — this closes the race where two concurrent
    # requests both pass that check before either commits.
    op.create_unique_constraint(
        'uq_conversion_visitor_experiment_goal',
        'conversions',
        ['visitor_id', 'experiment_id', 'goal'],
    )


def downgrade() -> None:
    op.drop_constraint(
        'uq_conversion_visitor_experiment_goal',
        'conversions',
        type_='unique',
    )