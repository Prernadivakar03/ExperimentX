"""add experiment guardrails and primary metric

Revision ID: a3b4c5d6e7f8
Revises: e2f3a4b5c6d7
Create Date: 2026-08-22 00:10:00.000000
"""
from alembic import op

revision = 'a3b4c5d6e7f8'
down_revision = 'e2f3a4b5c6d7'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("""
        DO $$ BEGIN
            CREATE TYPE guardraildirection AS ENUM ('higher_is_better', 'lower_is_better');
        EXCEPTION WHEN duplicate_object THEN null; END $$;
    """)

    op.execute(
        "ALTER TABLE experiments ADD COLUMN IF NOT EXISTS primary_metric_id UUID REFERENCES metrics(id);"
    )

    op.execute("""
        CREATE TABLE IF NOT EXISTS experiment_guardrails (
            id UUID PRIMARY KEY,
            experiment_id UUID NOT NULL REFERENCES experiments(id),
            metric_id UUID NOT NULL REFERENCES metrics(id),
            direction guardraildirection NOT NULL DEFAULT 'higher_is_better',
            max_regression_pct FLOAT NOT NULL DEFAULT 5.0,
            created_at TIMESTAMP
        );
    """)

    # Catches BOTH condition names — Postgres reports a duplicate named
    # UNIQUE constraint as duplicate_table (42P07), not duplicate_object
    # (42710), because the constraint's backing index shares pg_class's
    # namespace. create_all() may have already created this constraint
    # before Alembic ran, so this must be a true no-op either way.
    op.execute("""
        DO $$ BEGIN
            ALTER TABLE experiment_guardrails
            ADD CONSTRAINT uq_guardrail_experiment_metric UNIQUE (experiment_id, metric_id);
        EXCEPTION WHEN duplicate_object OR duplicate_table THEN null; END $$;
    """)


def downgrade() -> None:
    op.execute("DROP TABLE IF EXISTS experiment_guardrails;")
    op.execute("ALTER TABLE experiments DROP COLUMN IF EXISTS primary_metric_id;")
    op.execute("DROP TYPE IF EXISTS guardraildirection;")