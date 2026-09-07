"""organization experiment/statistical settings

Revision ID: a1c9f3e2b7d4
Revises: 408050dcc94c
Create Date: 2026-09-06 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'a1c9f3e2b7d4'
down_revision: Union[str, Sequence[str], None] = '408050dcc94c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Org-wide experiment/statistical defaults, previously only faked in the
    # frontend (Settings > Experiments saved nothing). server_default='{}' so
    # existing rows backfill cleanly without a data migration.
    op.add_column(
        'organizations',
        sa.Column('settings', sa.JSON(), nullable=False, server_default='{}'),
    )


def downgrade() -> None:
    op.drop_column('organizations', 'settings')