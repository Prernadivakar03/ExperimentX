"""
Run from backend/ with: pytest tests/integration/test_org_isolation.py -v
Requires a real Postgres database -- see tests/integration/conftest.py.
"""
from tests.integration.conftest import make_user_and_org, make_api_key, make_experiment
from app.core.security import create_access_token


def _auth_headers(user):
    return {"Authorization": f"Bearer {create_access_token(str(user.id))}"}


def test_org_a_api_key_cannot_assign_visitors_on_org_b_experiment(client, db_session):
    user_a, org_a = make_user_and_org(db_session)
    api_key_a = make_api_key(db_session, org_a)

    user_b, org_b = make_user_and_org(db_session)
    experiment_b, _ = make_experiment(db_session, org_b)

    resp = client.post(
        "/assign", headers={"X-API-Key": api_key_a},
        json={"experiment_id": str(experiment_b.id), "fingerprint": "visitor-cross-org"},
    )
    assert resp.status_code == 404


def test_org_a_api_key_cannot_track_conversion_on_org_b_experiment(client, db_session):
    user_a, org_a = make_user_and_org(db_session)
    api_key_a = make_api_key(db_session, org_a)

    user_b, org_b = make_user_and_org(db_session)
    api_key_b = make_api_key(db_session, org_b)
    experiment_b, variants_b = make_experiment(db_session, org_b)

    legit = client.post(
        "/assign", headers={"X-API-Key": api_key_b},
        json={"experiment_id": str(experiment_b.id), "fingerprint": "visitor-legit-org-b"},
    ).json()

    resp = client.post(
        "/track-conversion", headers={"X-API-Key": api_key_a},
        json={
            "experiment_id": str(experiment_b.id), "variant_id": legit["variant_id"],
            "visitor_id": legit["visitor_id"], "goal": experiment_b.goal,
        },
    )
    assert resp.status_code == 404


def test_org_a_dashboard_user_cannot_view_org_b_analytics(client, db_session):
    user_a, org_a = make_user_and_org(db_session)
    user_b, org_b = make_user_and_org(db_session)
    experiment_b, _ = make_experiment(db_session, org_b)

    resp = client.get(f"/analytics/{experiment_b.id}", headers=_auth_headers(user_a))
    assert resp.status_code in (403, 404)


def test_org_a_dashboard_user_can_view_own_org_analytics(client, db_session):
    user_a, org_a = make_user_and_org(db_session)
    experiment_a, _ = make_experiment(db_session, org_a)

    resp = client.get(f"/analytics/{experiment_a.id}", headers=_auth_headers(user_a))
    assert resp.status_code == 200


def test_api_key_cannot_be_used_after_revocation(client, db_session):
    from app.models.api_key import ApiKey
    from app.core.api_keys import generate_api_key
    from datetime import datetime

    user, org = make_user_and_org(db_session)
    experiment, _ = make_experiment(db_session, org)

    generated = generate_api_key(key_type="public")
    record = ApiKey(
        organization_id=org.id, name="revoked key",
        key_prefix=generated["display_prefix"], key_hash=generated["key_hash"],
        key_type=generated["key_type"], revoked_at=datetime.utcnow(),
    )
    db_session.add(record)
    db_session.commit()

    resp = client.post(
        "/assign", headers={"X-API-Key": generated["full_key"]},
        json={"experiment_id": str(experiment.id), "fingerprint": "visitor-after-revoke"},
    )
    assert resp.status_code == 401


def test_public_key_cannot_authenticate_as_secret_key_dependency(db_session):
    from fastapi import HTTPException
    from app.dependencies import get_org_from_secret_api_key
    from app.models.api_key import ApiKey
    from app.core.api_keys import generate_api_key

    user, org = make_user_and_org(db_session)
    generated = generate_api_key(key_type="public")
    record = ApiKey(
        organization_id=org.id, name="public key",
        key_prefix=generated["display_prefix"], key_hash=generated["key_hash"],
        key_type=generated["key_type"],
    )
    db_session.add(record)
    db_session.commit()

    try:
        get_org_from_secret_api_key(api_key=generated["full_key"], db=db_session)
        assert False, "expected HTTPException for a public key against the secret-key dependency"
    except HTTPException as exc:
        assert exc.status_code == 403