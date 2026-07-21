# backend/alembic/versions/c9d0e1f2a3b4_add_organization_id_to_owned_resources.py
"""add organization_id to owned resources

Revision ID: c9d0e1f2a3b4
Revises: b8c9d0e1f2a3
Create Date: 2026-07-20
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
import uuid

revision = 'c9d0e1f2a3b4'
down_revision = 'b8c9d0e1f2a3'
branch_labels = None
depends_on = None

# Every one of these tables currently has owner_id (single-user ownership).
# We're adding organization_id alongside it so access control can be
# membership/role based instead of raw ownership equality.
OWNED_TABLES = (
    "experiments",
    "feature_flags",
    "mutual_exclusion_groups",
    "holdout_groups",
    "metrics",
)


def upgrade():
    # 1. Add nullable organization_id columns first (can't be NOT NULL yet —
    #    existing rows have no value until we backfill below).
    for table in OWNED_TABLES:
        op.add_column(
            table,
            sa.Column(
                "organization_id",
                postgresql.UUID(as_uuid=True),
                sa.ForeignKey("organizations.id"),
                nullable=True,
            ),
        )

    conn = op.get_bind()

    # 2. Give every existing user a personal organization, unless they
    #    already created one (safe to re-run if this migration partially
    #    failed previously).
    users = conn.execute(sa.text("SELECT id, name FROM users")).fetchall()

    for user_id, name in users:
        existing_org = conn.execute(
            sa.text("""
                SELECT o.id FROM organizations o
                JOIN memberships m ON m.organization_id = o.id
                WHERE m.user_id = :uid AND o.created_by = :uid
                LIMIT 1
            """),
            {"uid": user_id},
        ).fetchone()

        if existing_org:
            org_id = existing_org[0]
        else:
            org_id = uuid.uuid4()
            conn.execute(
                sa.text("""
                    INSERT INTO organizations (id, name, created_by, created_at)
                    VALUES (:id, :name, :created_by, now())
                """),
                {"id": org_id, "name": f"{name}'s Workspace", "created_by": user_id},
            )
            conn.execute(
                sa.text("""
                    INSERT INTO memberships (id, organization_id, user_id, role, accepted_at, invited_at)
                    VALUES (:id, :org_id, :uid, 'admin', now(), now())
                """),
                {"id": uuid.uuid4(), "org_id": org_id, "uid": user_id},
            )

        # 3. Point every resource this user owns at their personal org
        for table in OWNED_TABLES:
            conn.execute(
                sa.text(
                    f"UPDATE {table} SET organization_id = :org_id "
                    f"WHERE owner_id = :uid AND organization_id IS NULL"
                ),
                {"org_id": org_id, "uid": user_id},
            )

    # 4. Every row now has an organization_id — enforce it going forward.
    for table in OWNED_TABLES:
        op.alter_column(table, "organization_id", nullable=False)


def downgrade():
    for table in OWNED_TABLES:
        op.drop_column(table, "organization_id")