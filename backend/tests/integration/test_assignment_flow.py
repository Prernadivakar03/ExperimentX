"""
Run from backend/ with: pytest tests/integration/test_assignment_flow.py -v
Requires a real Postgres database -- see tests/integration/conftest.py.
"""
from tests.integration.conftest import make_user_and_org, make_api_key, make_experiment


def test_assign_new_visitor_gets_a_variant(client, db_session):
    user, org = make_user_and_org(db_session)
    api_key = make_api_key(db_session, org)
    experiment, variants = make_experiment(db_session, org)

    resp = client.post(
        "/assign",
        headers={"X-API-Key": api_key},
        json={"experiment_id": str(experiment.id), "fingerprint": "visitor-abc-123"},
    )

    assert resp.status_code == 200
    body = resp.json()
    assert body["eligible"] is True
    assert body["already_assigned"] is False
    assert body["variant_label"] in ("A", "B")


def test_assign_same_fingerprint_returns_same_variant_every_time(client, db_session):
    """The core promise of the assignment system: a returning visitor must
    always see the same variant, not get re-randomized on every page load."""
    user, org = make_user_and_org(db_session)
    api_key = make_api_key(db_session, org)
    experiment, variants = make_experiment(db_session, org)

    fingerprint = "visitor-returning-456"
    first = client.post(
        "/assign", headers={"X-API-Key": api_key},
        json={"experiment_id": str(experiment.id), "fingerprint": fingerprint},
    ).json()

    for _ in range(5):
        again = client.post(
            "/assign", headers={"X-API-Key": api_key},
            json={"experiment_id": str(experiment.id), "fingerprint": fingerprint},
        ).json()
        assert again["variant_id"] == first["variant_id"]
        assert again["already_assigned"] is True


def test_assign_distributes_across_variants_over_many_visitors(client, db_session):
    """Not a precise statistical test -- just a sanity check that a 50/50
    split doesn't put everyone in the same bucket."""
    user, org = make_user_and_org(db_session)
    api_key = make_api_key(db_session, org)
    experiment, variants = make_experiment(db_session, org)

    labels_seen = set()
    for i in range(50):
        resp = client.post(
            "/assign", headers={"X-API-Key": api_key},
            json={"experiment_id": str(experiment.id), "fingerprint": f"visitor-{i}"},
        )
        labels_seen.add(resp.json()["variant_label"])

    assert labels_seen == {"A", "B"}


def test_assign_rejects_missing_api_key(client, db_session):
    user, org = make_user_and_org(db_session)
    experiment, variants = make_experiment(db_session, org)

    resp = client.post(
        "/assign",
        json={"experiment_id": str(experiment.id), "fingerprint": "visitor-xyz"},
    )
    assert resp.status_code == 422 or resp.status_code == 401


def test_assign_rejects_invalid_api_key(client, db_session):
    user, org = make_user_and_org(db_session)
    experiment, variants = make_experiment(db_session, org)

    resp = client.post(
        "/assign", headers={"X-API-Key": "expx_public_not_a_real_key"},
        json={"experiment_id": str(experiment.id), "fingerprint": "visitor-xyz"},
    )
    assert resp.status_code == 401


def test_assign_rejects_non_running_experiment(client, db_session):
    user, org = make_user_and_org(db_session)
    api_key = make_api_key(db_session, org)
    experiment, variants = make_experiment(db_session, org, status="draft")

    resp = client.post(
        "/assign", headers={"X-API-Key": api_key},
        json={"experiment_id": str(experiment.id), "fingerprint": "visitor-xyz"},
    )
    assert resp.status_code == 404


def test_identify_links_fingerprint_to_user_id(client, db_session):
    user, org = make_user_and_org(db_session)
    api_key = make_api_key(db_session, org)
    experiment, variants = make_experiment(db_session, org)

    fingerprint = "visitor-pre-login-789"
    client.post(
        "/assign", headers={"X-API-Key": api_key},
        json={"experiment_id": str(experiment.id), "fingerprint": fingerprint},
    )

    resp = client.post(
        "/identify", headers={"X-API-Key": api_key},
        json={"fingerprint": fingerprint, "user_id": "customer-user-42"},
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["linked"] == 1
    assert body["conflicts"] == []

    by_user_id = client.post(
        "/assign", headers={"X-API-Key": api_key},
        json={"experiment_id": str(experiment.id), "fingerprint": "a-different-fingerprint", "user_id": "customer-user-42"},
    ).json()
    original = client.post(
        "/assign", headers={"X-API-Key": api_key},
        json={"experiment_id": str(experiment.id), "fingerprint": fingerprint},
    ).json()
    assert by_user_id["variant_id"] == original["variant_id"]