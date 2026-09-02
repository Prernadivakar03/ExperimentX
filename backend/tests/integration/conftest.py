"""
Integration test fixtures.

Unlike tests/*.py (fast, DB-mocked unit tests), these tests exercise the
real request flow through FastAPI + a real Postgres database. Your models
use Postgres-specific UUID/JSON columns, so SQLite is not an option here.

Setup required once, locally:
    createdb experimentx_test
    (or: psql -c "CREATE DATABASE experimentx_test;")

Override the connection with the TEST_DATABASE_URL env var if your local
Postgres isn't on the default user/password/port. Run with:
    pytest tests/integration -q

Isolation strategy: each test runs inside an outer transaction that is
rolled back at the end, so tests never see each other's data and the DB
is clean before every run without recreating tables each time. Route
handlers call db.commit() freely (that's real application behavior) --
this works because we open a SAVEPOINT and restart it after every commit,
via the after_transaction_end event. This is the standard pattern for
testing SQLAlchemy apps that manage their own commits.
"""
import os
import uuid
from datetime import datetime

import pytest
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

TEST_DATABASE_URL = os.getenv(
    "TEST_DATABASE_URL",
    "postgresql://postgres:postgres@localhost:5432/experimentx_test",
)

# Deliberately os.environ[...] = , NOT setdefault: the root backend/conftest.py
# already sets a fake, unreachable DATABASE_URL via setdefault (so the plain
# unit test suite never needs a real DB) -- that runs before this file, so a
# setdefault here would be a no-op. Integration tests genuinely need a real,
# reachable database, so this must unconditionally override it.
os.environ["DATABASE_URL"] = TEST_DATABASE_URL
os.environ.setdefault("SECRET_KEY", "test-secret-key-not-for-production")
os.environ.setdefault("GROQ_API_KEY", "test-groq-key-not-for-production")

# Import app.main AFTER setting DATABASE_URL -- it imports every model
# (registering each table on Base.metadata) and, transitively, app.database,
# which creates its engine from DATABASE_URL at import time.
import app.main as main_module  # noqa: E402
from app.database import Base, get_db  # noqa: E402

engine = create_engine(TEST_DATABASE_URL)


@pytest.fixture(scope="session", autouse=True)
def _create_schema():
    Base.metadata.create_all(engine)
    yield
    Base.metadata.drop_all(engine)


@pytest.fixture(autouse=True)
def _reset_rate_limiter():
    """
    app/core/limiter.py's pre-auth rate limiter (used on /assign,
    /track-event, /track-conversion, /flags/evaluate) is a module-level
    MemoryStorage singleton -- intentional in production (naturally resets
    on server restart, correctly throttles a live process), but it means
    the limiter's counters persist across every test in this same pytest
    process. A test that makes 50 requests (e.g. testing traffic
    distribution) burns real budget against the *next* test's requests
    from the same TestClient IP, causing unrelated tests to fail with 429s
    that have nothing to do with what they're actually testing. Reset
    before every test so each one starts with a fresh rate-limit window.
    """
    from app.core.limiter import _pre_auth_storage
    _pre_auth_storage.reset()
    yield


@pytest.fixture()
def db_session():
    connection = engine.connect()
    outer_txn = connection.begin()

    TestingSessionLocal = sessionmaker(bind=connection, autoflush=False, autocommit=False)
    session = TestingSessionLocal()

    nested = connection.begin_nested()

    @event.listens_for(session, "after_transaction_end")
    def _restart_savepoint(sess, trans):
        nonlocal nested
        if not nested.is_active:
            nested = connection.begin_nested()

    yield session

    session.close()
    outer_txn.rollback()
    connection.close()


@pytest.fixture()
def scheduler_session_override(db_session, monkeypatch):
    """
    scheduler.py's job functions open their own SessionLocal() bound to the
    real app engine -- a different connection than db_session, which would
    make them blind to any uncommitted setup data created via db_session
    within a test (Postgres READ COMMITTED isolation: one connection can't
    see another's uncommitted rows). This monkeypatches SessionLocal to
    return sessions bound to db_session's own connection instead, so
    scheduler jobs observe the same in-progress transaction. Each session
    it opens is independent (its own commit()/close() calls don't affect
    db_session's usability afterward) but shares the underlying connection.
    """
    connection = db_session.connection()
    SchedulerSessionLocal = sessionmaker(bind=connection, autoflush=False, autocommit=False)
    monkeypatch.setattr("app.core.scheduler.SessionLocal", SchedulerSessionLocal)
    yield


@pytest.fixture()
def client(db_session):
    def _override_get_db():
        try:
            yield db_session
        finally:
            pass

    main_module.app.dependency_overrides[get_db] = _override_get_db
    with TestClient(main_module.app) as test_client:
        yield test_client
    main_module.app.dependency_overrides.clear()


# ── Shared factories ────────────────────────────────────────────────────

def make_user_and_org(db_session, email=None, name="Test User"):
    from app.models.user import User
    from app.models.organization import Organization, Membership, MemberRole
    from app.core.security import hash_password

    email = email or f"{uuid.uuid4().hex[:10]}@example.com"
    user = User(name=name, email=email, password_hash=hash_password("TestPassword123!"))
    db_session.add(user)
    db_session.flush()

    org = Organization(name=f"{name}'s Org", created_by=user.id)
    db_session.add(org)
    db_session.flush()

    membership = Membership(
        organization_id=org.id, user_id=user.id, role=MemberRole.admin,
        accepted_at=datetime.utcnow(),
    )
    db_session.add(membership)
    db_session.commit()

    return user, org


def make_api_key(db_session, org, key_type="public"):
    from app.models.api_key import ApiKey
    from app.core.api_keys import generate_api_key

    generated = generate_api_key(key_type=key_type)
    record = ApiKey(
        organization_id=org.id, name="Test key",
        key_prefix=generated["display_prefix"], key_hash=generated["key_hash"],
        key_type=generated["key_type"],
    )
    db_session.add(record)
    db_session.commit()
    return generated["full_key"]


def make_metric(db_session, org, user, metric_type="conversion_rate"):
    from app.models.metric import Metric, MetricType

    metric = Metric(
        owner_id=user.id, organization_id=org.id,
        key="conversion_rate", name="Conversion Rate",
        metric_type=MetricType[metric_type],
    )
    db_session.add(metric)
    db_session.commit()
    db_session.refresh(metric)
    return metric


def make_guardrail(db_session, experiment, metric, max_regression_pct=10.0, direction="higher_is_better"):
    from app.models.experiment_guardrail import ExperimentGuardrail, GuardrailDirection

    guardrail = ExperimentGuardrail(
        experiment_id=experiment.id, metric_id=metric.id,
        direction=GuardrailDirection[direction], max_regression_pct=max_regression_pct,
    )
    db_session.add(guardrail)
    db_session.commit()
    return guardrail


def seed_visitors_and_conversions(db_session, experiment, variant, n_visitors, n_converted):
    """Creates n_visitors Visitor rows for the given variant, with the
    first n_converted of them each getting exactly one Conversion row."""
    from app.models.visitor import Visitor
    from app.models.conversion import Conversion

    visitors = []
    for i in range(n_visitors):
        v = Visitor(
            experiment_id=experiment.id, variant_id=variant.id,
            fingerprint=f"seed-{variant.label}-{i}-{uuid.uuid4().hex[:6]}",
        )
        db_session.add(v)
        visitors.append(v)
    db_session.flush()

    for v in visitors[:n_converted]:
        db_session.add(Conversion(
            experiment_id=experiment.id, variant_id=variant.id, visitor_id=v.id,
            goal=experiment.goal,
        ))
    db_session.commit()


def make_experiment(db_session, org, status="running", variant_splits=(0.5, 0.5)):
    from app.models.experiment import Experiment, ExperimentStatus
    from app.models.variant import Variant

    experiment = Experiment(
        organization_id=org.id, owner_id=org.created_by,
        name="Test Experiment", goal="Increase conversion rate",
        status=ExperimentStatus[status],
        allocation_mode="fixed",
    )
    db_session.add(experiment)
    db_session.flush()

    variants = []
    labels = ["A", "B", "C", "D"]
    for i, split in enumerate(variant_splits):
        v = Variant(
            experiment_id=experiment.id, label=labels[i], name=f"Variant {labels[i]}",
            traffic_split=split,
        )
        db_session.add(v)
        variants.append(v)

    db_session.commit()
    for v in variants:
        db_session.refresh(v)
    db_session.refresh(experiment)

    return experiment, variants