# backend/app/core/targeting.py
"""
Feature flag audience targeting.

`targeting_rules` on a flag is a JSON list, evaluated top-to-bottom. The
FIRST rule whose condition matches the visitor's context wins, and its own
rollout_percentage decides the outcome (bucketed the same deterministic way
as the flag-level rollout). If no rule matches, evaluation falls through to
the flag's global is_enabled/rollout_percentage — every existing flag with
an empty targeting_rules list behaves exactly as before.

Rule shape:
    {
        "attribute": "country" | "device" | "url_path" | "plan" | <any custom key>,
        "operator": "equals" | "not_equals" | "in" | "not_in" | "starts_with" | "contains",
        "value": "US"  or  ["US", "IN"],
        "rollout_percentage": 100   # optional, defaults to 100 = fully on for that segment
    }

A rule whose attribute is missing from the visitor's context never matches
(fails closed) — it can't silently switch on just because the SDK didn't
send that field.
"""
import hashlib
from typing import Any, Optional


def _matches(operator: str, rule_value: Any, actual_value: Optional[str]) -> bool:
    if actual_value is None:
        return False

    if operator == "equals":
        return str(actual_value).lower() == str(rule_value).lower()
    if operator == "not_equals":
        return str(actual_value).lower() != str(rule_value).lower()
    if operator == "in":
        vals = rule_value if isinstance(rule_value, list) else [rule_value]
        return str(actual_value).lower() in [str(v).lower() for v in vals]
    if operator == "not_in":
        vals = rule_value if isinstance(rule_value, list) else [rule_value]
        return str(actual_value).lower() not in [str(v).lower() for v in vals]
    if operator == "starts_with":
        return str(actual_value).lower().startswith(str(rule_value).lower())
    if operator == "contains":
        return str(rule_value).lower() in str(actual_value).lower()
    return False


def _bucket(seed: str) -> int:
    h = hashlib.sha256(seed.encode()).hexdigest()
    return int(h[:8], 16) % 100


def evaluate_targeting_rules(
    flag_key: str,
    rules: list[dict],
    context: dict[str, Optional[str]],
    fingerprint: str,
) -> tuple[Optional[bool], Optional[str]]:
    """
    Returns (enabled, reason) if a rule matched, else (None, None) so the
    caller knows to fall through to the flag's global rollout logic.
    """
    if not rules:
        return None, None

    for i, rule in enumerate(rules):
        attribute = rule.get("attribute")
        operator = rule.get("operator", "equals")
        rule_value = rule.get("value")
        actual_value = context.get(attribute)

        if not _matches(operator, rule_value, actual_value):
            continue

        rollout = max(0, min(100, int(rule.get("rollout_percentage", 100))))
        label = f"Matched rule #{i + 1} ({attribute} {operator} {rule_value})"

        if rollout >= 100:
            return True, f"{label} — 100% rollout"
        if rollout <= 0:
            return False, f"{label} — 0% rollout"

        bucket = _bucket(f"{flag_key}:rule{i}:{fingerprint}")
        return bucket < rollout, f"{label} — bucket {bucket} vs {rollout}%"

    return None, None