
from logging.config import fileConfig
import os

from sqlalchemy import engine_from_config, pool
from alembic import context
from dotenv import load_dotenv

# Load .env
load_dotenv()

config = context.config

# Set DATABASE_URL from .env into Alembic config
database_url = os.getenv("DATABASE_URL")

if not database_url:
    raise Exception("DATABASE_URL not found in .env")

config.set_main_option("sqlalchemy.url", database_url)

# Logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# -------------------------------------------------------------------
# Import Base
# -------------------------------------------------------------------
from app.database import Base

# -------------------------------------------------------------------
# Import ALL models so Alembic sees every table
# -------------------------------------------------------------------
from app.models.user import User
from app.models.token import RefreshToken
from app.models.organization import Organization, Membership
from app.models.experiment import Experiment
from app.models.variant import Variant
from app.models.visitor import Visitor
from app.models.event import Event
from app.models.conversion import Conversion
from app.models.activity_log import ActivityLog
from app.models.feature_flag import FeatureFlag
from app.models.metric import Metric

# Holdout models
from app.models.holdout import (
    HoldoutGroup,
    HoldoutVisitor,
    HoldoutConversion,
)

# Mutual Exclusion models
from app.models.mutual_exclusion import (
    MutualExclusionGroup,
    MutualExclusionMembership,
)

target_metadata = Base.metadata


def run_migrations_offline():
    """Run migrations in offline mode."""

    context.configure(
        url=database_url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    """Run migrations in online mode."""

    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
        future=True,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()