"""api key type (public/secret)

Revision ID: d070555d2c21
Revises: c03f4e9099fa
Create Date: 2026-08-27 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect

# revision identifiers, used by Alembic.
revision: str = 'd070555d2c21'
down_revision: Union[str, Sequence[str], None] = 'c03f4e9099fa'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    conn = op.get_bind()
    inspector = inspect(conn)
    existing_columns = {c["name"] for c in inspector.get_columns("api_keys")}

    if "key_type" not in existing_columns:
        # nullable first so the backfill can run, then locked down
        op.add_column('api_keys', sa.Column('key_type', sa.String(), nullable=True))
        # Every key that already exists was created before this split
        # existed and has been used for visitor-facing SDK calls only —
        # so "public" is the correct backfill, not a guess.
        op.execute("UPDATE api_keys SET key_type = 'public' WHERE key_type IS NULL")
        op.alter_column('api_keys', 'key_type', nullable=False, server_default='public')


def downgrade() -> None:
    op.drop_column('api_keys', 'key_type')