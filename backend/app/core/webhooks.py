"""
Outbound webhook notifications (Slack-compatible payload + generic JSON).
Fire-and-forget: a broken webhook should never break the experiment loop.
"""
import requests
import logging

logger = logging.getLogger("experimentx.webhooks")


def send_webhook(url: str, event_type: str, payload: dict, timeout: float = 3.0) -> bool:
    body = {"event": event_type, "data": payload}
    try:
        resp = requests.post(url, json=body, timeout=timeout)
        return resp.status_code < 300
    except requests.RequestException as e:
        logger.warning(f"Webhook delivery failed for {event_type}: {e}")
        return False


def send_slack_alert(webhook_url: str, event_type: str, experiment_name: str, message: str) -> bool:
    color = {
        "srm_detected": "#e01e5a",
        "significance_reached": "#2eb67d",
        "anomaly_detected": "#ecb22e",
    }.get(event_type, "#666")
    payload = {
        "attachments": [{
            "color": color,
            "title": f"ExperimentX — {experiment_name}",
            "text": message,
            "footer": event_type,
        }]
    }
    try:
        resp = requests.post(webhook_url, json=payload, timeout=3.0)
        return resp.status_code < 300
    except requests.RequestException as e:
        logger.warning(f"Slack webhook failed: {e}")
        return False