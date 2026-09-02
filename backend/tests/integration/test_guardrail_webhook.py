"""
Run from backend/ with: pytest tests/integration/test_guardrail_webhook.py -v
Requires a real Postgres database -- see tests/integration/conftest.py.
"""
import app.core.scheduler as scheduler_module
from tests.integration.conftest import (
    make_user_and_org, make_experiment, make_metric, make_guardrail,
    seed_visitors_and_conversions,
)


def test_guardrail_breach_pauses_experiment_and_fires_webhook(db_session, scheduler_session_override, monkeypatch):
    user, org = make_user_and_org(db_session)
    org.webhook_url = "https://hooks.slack.com/services/fake/webhook/url"
    org.webhook_events = ["guardrail_breach"]
    db_session.commit()

    experiment, variants = make_experiment(db_session, org)
    metric = make_metric(db_session, org, user, metric_type="conversion_rate")
    make_guardrail(db_session, experiment, metric, max_regression_pct=10.0, direction="higher_is_better")

    seed_visitors_and_conversions(db_session, experiment, variants[0], n_visitors=200, n_converted=100)
    seed_visitors_and_conversions(db_session, experiment, variants[1], n_visitors=200, n_converted=40)

    sent_alerts = []
    monkeypatch.setattr(
        scheduler_module, "send_slack_alert",
        lambda webhook_url, event_type, experiment_name, message: sent_alerts.append(
            {"webhook_url": webhook_url, "event_type": event_type, "experiment_name": experiment_name, "message": message}
        ),
    )

    scheduler_module._run_guardrail_checks()

    db_session.refresh(experiment)
    assert experiment.status.value == "paused"

    assert len(sent_alerts) == 1
    assert sent_alerts[0]["event_type"] == "guardrail_breach"
    assert sent_alerts[0]["experiment_name"] == experiment.name


def test_guardrail_does_not_fire_below_minimum_sample_size(db_session, scheduler_session_override, monkeypatch):
    user, org = make_user_and_org(db_session)
    org.webhook_url = "https://hooks.slack.com/services/fake/webhook/url"
    org.webhook_events = ["guardrail_breach"]
    db_session.commit()

    experiment, variants = make_experiment(db_session, org)
    metric = make_metric(db_session, org, user, metric_type="conversion_rate")
    make_guardrail(db_session, experiment, metric, max_regression_pct=10.0, direction="higher_is_better")

    seed_visitors_and_conversions(db_session, experiment, variants[0], n_visitors=10, n_converted=5)
    seed_visitors_and_conversions(db_session, experiment, variants[1], n_visitors=10, n_converted=2)

    sent_alerts = []
    monkeypatch.setattr(
        scheduler_module, "send_slack_alert",
        lambda *args, **kwargs: sent_alerts.append(args),
    )

    scheduler_module._run_guardrail_checks()

    db_session.refresh(experiment)
    assert experiment.status.value == "running"
    assert len(sent_alerts) == 0


def test_guardrail_does_not_fire_on_small_insignificant_change(db_session, scheduler_session_override, monkeypatch):
    user, org = make_user_and_org(db_session)
    org.webhook_url = "https://hooks.slack.com/services/fake/webhook/url"
    org.webhook_events = ["guardrail_breach"]
    db_session.commit()

    experiment, variants = make_experiment(db_session, org)
    metric = make_metric(db_session, org, user, metric_type="conversion_rate")
    make_guardrail(db_session, experiment, metric, max_regression_pct=10.0, direction="higher_is_better")

    seed_visitors_and_conversions(db_session, experiment, variants[0], n_visitors=200, n_converted=50)
    seed_visitors_and_conversions(db_session, experiment, variants[1], n_visitors=200, n_converted=46)

    sent_alerts = []
    monkeypatch.setattr(
        scheduler_module, "send_slack_alert",
        lambda *args, **kwargs: sent_alerts.append(args),
    )

    scheduler_module._run_guardrail_checks()

    db_session.refresh(experiment)
    assert experiment.status.value == "running"
    assert len(sent_alerts) == 0


def test_guardrail_skips_experiments_with_no_guardrails_attached(db_session, scheduler_session_override, monkeypatch):
    user, org = make_user_and_org(db_session)
    experiment, variants = make_experiment(db_session, org)
    seed_visitors_and_conversions(db_session, experiment, variants[0], n_visitors=200, n_converted=100)
    seed_visitors_and_conversions(db_session, experiment, variants[1], n_visitors=200, n_converted=10)

    scheduler_module._run_guardrail_checks()

    db_session.refresh(experiment)
    assert experiment.status.value == "running"