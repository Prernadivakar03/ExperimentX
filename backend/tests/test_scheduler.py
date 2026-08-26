"""
Run from backend/ with: pytest tests/test_scheduler.py -v

scheduler.py's job functions open their own SessionLocal() and talk to real
SQLAlchemy models (Experiment, Variant, Visitor, Conversion), which use
postgres-only UUID columns -- not something we can spin up against sqlite
in a fast unit test. Instead we monkeypatch SessionLocal to hand back a
fake session that fulfils the exact query shapes these two functions use:

  _run_scheduled_transitions:
      db.query(Experiment).filter(...).all()   (called twice: to_start, to_complete)

  _run_bandit_reallocation:
      db.query(Experiment).filter(...).all()
      exp.variants                              (plain attribute, not a query)
      db.query(Visitor).filter(Visitor.variant_id == v.id).count()
      db.query(Conversion).filter(Conversion.variant_id == v.id).count()
      db.query(Variant).filter(Variant.id == variant_id).first()

This keeps the tests fast and dependency-free while still exercising the
real branching/commit/rollback logic in scheduler.py.
"""
from datetime import datetime, timedelta
from types import SimpleNamespace

import pytest

import app.core.scheduler as scheduler_module
from app.models.experiment import ExperimentStatus
from app.models.visitor import Visitor
from app.models.conversion import Conversion
from app.models.variant import Variant


# ── fake DB plumbing ──────────────────────────────────────────────────────

class _QueueQuery:
    """Pops the next pre-set list for successive .query(SameModel).all() calls."""
    def __init__(self, queue):
        self._queue = queue

    def filter(self, *args, **kwargs):
        return self

    def all(self):
        return self._queue.pop(0) if self._queue else []


class _CountLookupQuery:
    """Extracts the id being filtered on, returns a pre-set count for it."""
    def __init__(self, counts_by_id):
        self._counts = counts_by_id
        self._key = None

    def filter(self, *args, **kwargs):
        if args:
            self._key = args[0].right.value
        return self

    def count(self):
        return self._counts.get(self._key, 0)


class _ConversionRowsQuery:
    """Synthesizes N distinct fake Conversion rows (one visitor_id each) for
    whatever count is configured for a variant_id. Mirrors
    scheduler._count_conversions, which counts DISTINCT visitor_id rather
    than raw row count -- since every synthesized row here has a unique
    visitor_id, the distinct count always equals the configured number,
    keeping existing test expectations unchanged while exercising the real
    (corrected) query shape."""
    def __init__(self, counts_by_id):
        self._counts = counts_by_id
        self._key = None

    def filter(self, *args, **kwargs):
        if args:
            self._key = args[0].right.value
        return self

    def all(self):
        n = self._counts.get(self._key, 0)
        return [SimpleNamespace(visitor_id=f"{self._key}-visitor-{i}") for i in range(n)]

    def count(self):
        return self._counts.get(self._key, 0)


class _ObjectLookupQuery:
    def __init__(self, objects_by_id):
        self._objects = objects_by_id
        self._key = None

    def filter(self, *args, **kwargs):
        if args:
            self._key = args[0].right.value
        return self

    def first(self):
        return self._objects.get(self._key)


class _FakeSession:
    def __init__(self):
        self.committed = 0
        self.rolled_back = 0
        self.closed = False
        self._queues = {}
        self.visitor_counts = {}
        self.conversion_counts = {}
        self.variants_by_id = {}

    def queue_experiments(self, results):
        self._queues.setdefault("Experiment", []).append(results)

    def query(self, model):
        if model is Visitor:
            return _CountLookupQuery(self.visitor_counts)
        if model is Conversion:
            return _ConversionRowsQuery(self.conversion_counts)
        if model is Variant:
            return _ObjectLookupQuery(self.variants_by_id)
        return _QueueQuery(self._queues.get("Experiment", []))

    def add(self, obj):
        pass

    def commit(self):
        self.committed += 1

    def refresh(self, obj):
        pass

    def rollback(self):
        self.rolled_back += 1

    def close(self):
        self.closed = True


def _experiment(status, exp_id="exp-1", allocation_mode=None, variants=None):
    return SimpleNamespace(
        id=exp_id, name="Test Experiment", status=status,
        allocation_mode=allocation_mode, variants=variants or [],
    )


def _variant(variant_id, label):
    return SimpleNamespace(id=variant_id, label=label, traffic_split=0.5)


@pytest.fixture
def fake_session(monkeypatch):
    session = _FakeSession()
    monkeypatch.setattr(scheduler_module, "SessionLocal", lambda: session)
    monkeypatch.setattr(scheduler_module, "log_activity", lambda *a, **k: None)
    return session


# ── _run_scheduled_transitions ───────────────────────────────────────────

def test_draft_experiment_transitions_to_running(fake_session):
    exp = _experiment(ExperimentStatus.draft)
    fake_session.queue_experiments([exp])   # to_start query
    fake_session.queue_experiments([])      # to_complete query

    scheduler_module._run_scheduled_transitions()

    assert exp.status == ExperimentStatus.running
    assert fake_session.committed == 1
    assert fake_session.closed is True


def test_running_experiment_transitions_to_completed(fake_session):
    exp = _experiment(ExperimentStatus.running)
    fake_session.queue_experiments([])      # to_start query
    fake_session.queue_experiments([exp])   # to_complete query

    scheduler_module._run_scheduled_transitions()

    assert exp.status == ExperimentStatus.completed
    assert fake_session.committed == 1


def test_no_due_experiments_is_a_clean_noop(fake_session):
    fake_session.queue_experiments([])
    fake_session.queue_experiments([])

    scheduler_module._run_scheduled_transitions()

    assert fake_session.committed == 0
    assert fake_session.rolled_back == 0
    assert fake_session.closed is True


def test_multiple_due_experiments_all_transition(fake_session):
    exp1 = _experiment(ExperimentStatus.draft, exp_id="exp-1")
    exp2 = _experiment(ExperimentStatus.draft, exp_id="exp-2")
    fake_session.queue_experiments([exp1, exp2])
    fake_session.queue_experiments([])

    scheduler_module._run_scheduled_transitions()

    assert exp1.status == ExperimentStatus.running
    assert exp2.status == ExperimentStatus.running
    assert fake_session.committed == 2


def test_db_error_triggers_rollback_and_still_closes(monkeypatch, fake_session):
    def boom():
        raise RuntimeError("db exploded")

    # Make the very first query blow up
    monkeypatch.setattr(fake_session, "query", lambda model: (_ for _ in ()).throw(RuntimeError("db exploded")))

    # Should not raise -- the function swallows and logs internally
    scheduler_module._run_scheduled_transitions()

    assert fake_session.rolled_back == 1
    assert fake_session.closed is True


# ── _run_bandit_reallocation ─────────────────────────────────────────────

def test_bandit_reallocation_updates_traffic_split(fake_session, monkeypatch):
    var_a = _variant("v-a", "A")
    var_b = _variant("v-b", "B")
    exp = _experiment(ExperimentStatus.running, allocation_mode="bandit", variants=[var_a, var_b])

    fake_session.queue_experiments([exp])
    fake_session.visitor_counts = {"v-a": 1000, "v-b": 1000}
    fake_session.conversion_counts = {"v-a": 50, "v-b": 90}
    fake_session.variants_by_id = {"v-a": var_a, "v-b": var_b}

    monkeypatch.setattr(
        scheduler_module, "thompson_sample_allocation",
        lambda variants_data: {
            "allocations": [
                {"label": "A", "allocation_pct": 30.0},
                {"label": "B", "allocation_pct": 70.0},
            ]
        },
    )

    scheduler_module._run_bandit_reallocation()

    assert var_a.traffic_split == pytest.approx(0.30)
    assert var_b.traffic_split == pytest.approx(0.70)
    assert fake_session.committed == 1


def test_bandit_reallocation_skips_experiments_with_fewer_than_two_variants(fake_session, monkeypatch):
    var_a = _variant("v-a", "A")
    exp = _experiment(ExperimentStatus.running, allocation_mode="bandit", variants=[var_a])
    fake_session.queue_experiments([exp])

    called = {"thompson": False}
    monkeypatch.setattr(
        scheduler_module, "thompson_sample_allocation",
        lambda variants_data: called.__setitem__("thompson", True) or {"allocations": []},
    )

    scheduler_module._run_bandit_reallocation()

    assert called["thompson"] is False
    assert fake_session.committed == 0


def test_bandit_reallocation_skips_gracefully_on_allocation_error(fake_session, monkeypatch):
    var_a = _variant("v-a", "A")
    var_b = _variant("v-b", "B")
    original_split_a, original_split_b = var_a.traffic_split, var_b.traffic_split
    exp = _experiment(ExperimentStatus.running, allocation_mode="bandit", variants=[var_a, var_b])

    fake_session.queue_experiments([exp])
    fake_session.visitor_counts = {"v-a": 0, "v-b": 0}
    fake_session.conversion_counts = {"v-a": 0, "v-b": 0}

    monkeypatch.setattr(
        scheduler_module, "thompson_sample_allocation",
        lambda variants_data: {"error": "Conversions cannot exceed visitors"},
    )

    scheduler_module._run_bandit_reallocation()

    # nothing should have been touched -- the error path must bail cleanly
    assert var_a.traffic_split == original_split_a
    assert var_b.traffic_split == original_split_b
    assert fake_session.committed == 0
    assert fake_session.closed is True


def test_bandit_reallocation_no_bandit_experiments_is_a_noop(fake_session, monkeypatch):
    fake_session.queue_experiments([])
    monkeypatch.setattr(
        scheduler_module, "thompson_sample_allocation",
        lambda variants_data: {"allocations": []},
    )

    scheduler_module._run_bandit_reallocation()

    assert fake_session.committed == 0
    assert fake_session.closed is True


def test_bandit_reallocation_error_triggers_rollback(fake_session, monkeypatch):
    monkeypatch.setattr(
        fake_session, "query",
        lambda model: (_ for _ in ()).throw(RuntimeError("db exploded")),
    )

    scheduler_module._run_bandit_reallocation()

    assert fake_session.rolled_back == 1
    assert fake_session.closed is True


# ── helper functions ─────────────────────────────────────────────────────

def test_count_visitors_uses_variant_id_filter(fake_session):
    fake_session.visitor_counts = {"v-a": 42}
    result = scheduler_module._count_visitors("v-a", fake_session)
    assert result == 42


def test_count_conversions_uses_variant_id_filter(fake_session):
    fake_session.conversion_counts = {"v-a": 7}
    result = scheduler_module._count_conversions("v-a", fake_session)
    assert result == 7