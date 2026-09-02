"""
Run from backend/ with: pytest tests/integration/test_conversion_flow.py -v
Requires a real Postgres database -- see tests/integration/conftest.py.
"""
from tests.integration.conftest import make_user_and_org, make_api_key, make_experiment
from app.core.security import create_access_token


def _auth_headers(user):
    return {"Authorization": f"Bearer {create_access_token(str(user.id))}"}


def _assign(client, api_key, experiment, fingerprint):
    return client.post(
        "/assign", headers={"X-API-Key": api_key},
        json={"experiment_id": str(experiment.id), "fingerprint": fingerprint},
    ).json()


def test_conversion_flow_reflects_correctly_in_analytics(client, db_session):
    user, org = make_user_and_org(db_session)
    api_key = make_api_key(db_session, org)
    experiment, variants = make_experiment(db_session, org)

    assignments = [_assign(client, api_key, experiment, f"visitor-{i}") for i in range(20)]

    converted = 0
    for a in assignments:
        if converted >= 2:
            break
        resp = client.post(
            "/track-conversion", headers={"X-API-Key": api_key},
            json={
                "experiment_id": str(experiment.id), "variant_id": a["variant_id"],
                "visitor_id": a["visitor_id"], "goal": experiment.goal,
            },
        )
        assert resp.status_code == 201
        converted += 1

    resp = client.get(f"/analytics/{experiment.id}", headers=_auth_headers(user))
    assert resp.status_code == 200
    body = resp.json()

    total_visitors = sum(v["visitors"] for v in body["variants"])
    total_conversions = sum(v["conversions"] for v in body["variants"])
    assert total_visitors == 20
    assert total_conversions == 2


def test_repeat_conversion_same_goal_does_not_double_count(client, db_session):
    """A visitor converting twice for the SAME goal (e.g. a flaky-network
    SDK retry firing trackConversion() twice) must only count once."""
    user, org = make_user_and_org(db_session)
    api_key = make_api_key(db_session, org)
    experiment, variants = make_experiment(db_session, org)

    a = _assign(client, api_key, experiment, "visitor-repeat-convert")

    for _ in range(3):
        resp = client.post(
            "/track-conversion", headers={"X-API-Key": api_key},
            json={
                "experiment_id": str(experiment.id), "variant_id": a["variant_id"],
                "visitor_id": a["visitor_id"], "goal": experiment.goal,
            },
        )
        assert resp.status_code == 201

    resp = client.get(f"/analytics/{experiment.id}", headers=_auth_headers(user))
    body = resp.json()
    total_conversions = sum(v["conversions"] for v in body["variants"])
    assert total_conversions == 1


def test_track_conversion_rejects_wrong_goal(client, db_session):
    user, org = make_user_and_org(db_session)
    api_key = make_api_key(db_session, org)
    experiment, variants = make_experiment(db_session, org)

    a = _assign(client, api_key, experiment, "visitor-wrong-goal")

    resp = client.post(
        "/track-conversion", headers={"X-API-Key": api_key},
        json={
            "experiment_id": str(experiment.id), "variant_id": a["variant_id"],
            "visitor_id": a["visitor_id"], "goal": "some-other-goal-entirely",
        },
    )
    assert resp.status_code == 400


def test_track_event_rejects_visitor_from_different_experiment(client, db_session):
    user, org = make_user_and_org(db_session)
    api_key = make_api_key(db_session, org)
    experiment_1, _ = make_experiment(db_session, org)
    experiment_2, variants_2 = make_experiment(db_session, org)

    a = _assign(client, api_key, experiment_1, "visitor-cross-experiment")

    resp = client.post(
        "/track-event", headers={"X-API-Key": api_key},
        json={
            "experiment_id": str(experiment_2.id), "variant_id": str(variants_2[0].id),
            "visitor_id": a["visitor_id"], "event_type": "button_click",
        },
    )
    assert resp.status_code == 404