"""
Run from backend/ with: pytest tests/test_rbac.py -v

These tests don't touch a real database — check_org_access() and
get_primary_org_id() only ever call db.query(...).filter(...).first(),
so we fake that chain with a tiny stub. This keeps the tests fast and
matches the rest of this suite (no DB fixtures used anywhere else either).
"""
import uuid
from datetime import datetime
from types import SimpleNamespace

import pytest
from fastapi import HTTPException

from app.core.rbac import check_org_access, get_primary_org_id
from app.models.organization import MemberRole


class _FakeQuery:
    """Mimics db.query(Membership).filter(...).first()/.order_by(...).first()"""
    def __init__(self, result):
        self._result = result

    def filter(self, *args, **kwargs):
        return self

    def order_by(self, *args, **kwargs):
        return self

    def first(self):
        return self._result


class _FakeDB:
    def __init__(self, result):
        self._result = result

    def query(self, model):
        return _FakeQuery(self._result)


def _membership(role, accepted=True, invited_at=None):
    return SimpleNamespace(
        id=uuid.uuid4(),
        organization_id=uuid.uuid4(),
        user_id=uuid.uuid4(),
        role=role,
        accepted_at=datetime.utcnow() if accepted else None,
        invited_at=invited_at or datetime.utcnow(),
    )


def _user():
    return SimpleNamespace(id=uuid.uuid4())


# ── check_org_access ─────────────────────────────────────────────────────

def test_no_organization_id_is_forbidden():
    with pytest.raises(HTTPException) as exc:
        check_org_access(None, _user(), _FakeDB(None))
    assert exc.value.status_code == 403


def test_non_member_is_forbidden():
    with pytest.raises(HTTPException) as exc:
        check_org_access(uuid.uuid4(), _user(), _FakeDB(None))
    assert exc.value.status_code == 403
    assert "Not a member" in exc.value.detail


def test_viewer_can_access_viewer_route():
    membership = _membership(MemberRole.viewer)
    result = check_org_access(membership.organization_id, _user(), _FakeDB(membership), MemberRole.viewer)
    assert result is membership


def test_viewer_cannot_access_editor_route():
    membership = _membership(MemberRole.viewer)
    with pytest.raises(HTTPException) as exc:
        check_org_access(membership.organization_id, _user(), _FakeDB(membership), MemberRole.editor)
    assert exc.value.status_code == 403
    assert "editor" in exc.value.detail


def test_editor_cannot_access_admin_route():
    membership = _membership(MemberRole.editor)
    with pytest.raises(HTTPException):
        check_org_access(membership.organization_id, _user(), _FakeDB(membership), MemberRole.admin)


def test_admin_can_access_every_lower_route():
    membership = _membership(MemberRole.admin)
    db = _FakeDB(membership)
    for required in (MemberRole.viewer, MemberRole.editor, MemberRole.admin):
        assert check_org_access(membership.organization_id, _user(), db, required) is membership


def test_editor_can_access_viewer_and_editor_routes():
    membership = _membership(MemberRole.editor)
    db = _FakeDB(membership)
    assert check_org_access(membership.organization_id, _user(), db, MemberRole.viewer) is membership
    assert check_org_access(membership.organization_id, _user(), db, MemberRole.editor) is membership


def test_default_minimum_role_is_viewer():
    # calling with no explicit minimum_role should behave like requiring viewer
    membership = _membership(MemberRole.viewer)
    result = check_org_access(membership.organization_id, _user(), _FakeDB(membership))
    assert result is membership


# ── get_primary_org_id ───────────────────────────────────────────────────

def test_get_primary_org_id_returns_orgs_id():
    membership = _membership(MemberRole.admin)
    org_id = get_primary_org_id(_user(), _FakeDB(membership))
    assert org_id == membership.organization_id


def test_get_primary_org_id_raises_if_user_has_no_org():
    with pytest.raises(HTTPException) as exc:
        get_primary_org_id(_user(), _FakeDB(None))
    assert exc.value.status_code == 500