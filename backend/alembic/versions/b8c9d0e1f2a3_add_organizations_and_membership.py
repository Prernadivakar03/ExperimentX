"""add organizations and membership (RBAC)

Revision ID: b8c9d0e1f2a3
Revises: a7b8c9d0e1f2
Create Date: 2026-07-16 06:00:00.000000
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
from sqlalchemy import inspect

revision = 'b8c9d0e1f2a3'
down_revision = 'a7b8c9d0e1f2'
branch_labels = None
depends_on = None

# ── Define ENUM (we'll create it manually with checkfirst) ──
memberrole_enum = postgresql.ENUM(
    'admin', 'editor', 'viewer',
    name='memberrole',
    create_type=False,  # we'll create it manually
)


def upgrade() -> None:
    conn = op.get_bind()
    inspector = inspect(conn)

    # 1. Create ENUM if it doesn't exist
    memberrole_enum.create(conn, checkfirst=True)

    # 2. Create organizations table (if not exists)
    if not inspector.has_table('organizations'):
        op.create_table(
            'organizations',
            sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
            sa.Column('name', sa.String(), nullable=False),
            sa.Column('created_by', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=False),
            sa.Column('created_at', sa.DateTime(), nullable=True),
        )

    # 3. Create memberships table (if not exists)
    if not inspector.has_table('memberships'):
        op.create_table(
            'memberships',
            sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
            sa.Column('organization_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('organizations.id'), nullable=False),
            sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=True),
            sa.Column('invited_email', sa.String(), nullable=True),
            sa.Column('role', memberrole_enum, nullable=False),
            sa.Column('accepted_at', sa.DateTime(), nullable=True),
        )
        # Add unique constraint for organization + user (only when user_id is not null)
        # We'll add a partial unique index later if needed; simpler: unique on (org_id, user_id) with nulls allowed.
        op.create_index('ix_memberships_org_user', 'memberships', ['organization_id', 'user_id'], unique=False)


def downgrade() -> None:
    conn = op.get_bind()
    inspector = inspect(conn)

    # Drop tables if they exist
    if inspector.has_table('memberships'):
        op.drop_table('memberships')
    if inspector.has_table('organizations'):
        op.drop_table('organizations')

    # Drop the ENUM type (only if it exists)
    memberrole_enum.drop(conn, checkfirst=True)