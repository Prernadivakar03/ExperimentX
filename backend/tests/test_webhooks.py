"""
Run from backend/ with: pytest tests/test_webhooks.py -v

Uses monkeypatch to fake requests.post so no real network calls are made.
"""
import requests
import pytest
from app.core.webhooks import send_webhook, send_slack_alert


class _FakeResponse:
    def __init__(self, status_code):
        self.status_code = status_code


# ── send_webhook ─────────────────────────────────────────────────────────

def test_send_webhook_success(monkeypatch):
    captured = {}

    def fake_post(url, json=None, timeout=None):
        captured["url"] = url
        captured["json"] = json
        captured["timeout"] = timeout
        return _FakeResponse(200)

    monkeypatch.setattr(requests, "post", fake_post)

    result = send_webhook("https://example.com/hook", "srm_detected", {"foo": "bar"})

    assert result is True
    assert captured["url"] == "https://example.com/hook"
    assert captured["json"] == {"event": "srm_detected", "data": {"foo": "bar"}}


def test_send_webhook_non_2xx_returns_false(monkeypatch):
    monkeypatch.setattr(requests, "post", lambda *a, **k: _FakeResponse(500))
    result = send_webhook("https://example.com/hook", "srm_detected", {})
    assert result is False


def test_send_webhook_network_error_does_not_raise(monkeypatch):
    def fake_post(*args, **kwargs):
        raise requests.exceptions.ConnectionError("boom")

    monkeypatch.setattr(requests, "post", fake_post)

    # This is the whole point of the function: a dead webhook URL must
    # never bubble up and break the experiment/analytics request.
    result = send_webhook("https://dead-url.example", "anomaly_detected", {})
    assert result is False


def test_send_webhook_timeout_is_passed_through(monkeypatch):
    captured = {}

    def fake_post(url, json=None, timeout=None):
        captured["timeout"] = timeout
        return _FakeResponse(200)

    monkeypatch.setattr(requests, "post", fake_post)
    send_webhook("https://example.com/hook", "significance_reached", {}, timeout=1.5)
    assert captured["timeout"] == 1.5


# ── send_slack_alert ─────────────────────────────────────────────────────

def test_send_slack_alert_success(monkeypatch):
    captured = {}

    def fake_post(url, json=None, timeout=None):
        captured["json"] = json
        return _FakeResponse(200)

    monkeypatch.setattr(requests, "post", fake_post)

    result = send_slack_alert(
        "https://hooks.slack.com/services/xxx",
        "srm_detected",
        "Checkout Button Color",
        "SRM detected: expected 50/50 split, observed 62/38",
    )

    assert result is True
    attachment = captured["json"]["attachments"][0]
    assert attachment["color"] == "#e01e5a"
    assert "Checkout Button Color" in attachment["title"]
    assert attachment["footer"] == "srm_detected"


def test_send_slack_alert_uses_correct_color_per_event_type(monkeypatch):
    captured = []
    monkeypatch.setattr(
        requests, "post",
        lambda url, json=None, timeout=None: (captured.append(json), _FakeResponse(200))[1]
    )

    send_slack_alert("https://hooks.slack.com/x", "significance_reached", "Exp", "msg")
    send_slack_alert("https://hooks.slack.com/x", "anomaly_detected", "Exp", "msg")
    send_slack_alert("https://hooks.slack.com/x", "unknown_event_type", "Exp", "msg")

    colors = [c["attachments"][0]["color"] for c in captured]
    assert colors == ["#2eb67d", "#ecb22e", "#666"]


def test_send_slack_alert_network_failure_returns_false(monkeypatch):
    def fake_post(*args, **kwargs):
        raise requests.exceptions.Timeout("too slow")

    monkeypatch.setattr(requests, "post", fake_post)
    result = send_slack_alert("https://hooks.slack.com/x", "srm_detected", "Exp", "msg")
    assert result is False