"""
Run from backend/ with: pytest tests/test_explainability.py -v
NOTE: imports app.core.explainability — if you named the real function
differently, adjust the import below to match your actual file.
"""
import pytest
from app.core.explainability import find_largest_divergence


def _variant(label, event_breakdown):
    return {"label": label, "event_breakdown": event_breakdown}


def test_no_divergence_when_only_one_variant():
    assert find_largest_divergence([_variant("A", {})]) == []


def test_finds_gap_in_shared_event_type():
    control = _variant("A", {"add_to_cart": {"count": 100, "rate_per_visitor": 10.0}})
    variant = _variant("B", {"add_to_cart": {"count": 180, "rate_per_visitor": 18.0}})
    result = find_largest_divergence([control, variant])
    assert len(result) == 1
    assert result[0]["event_type"] == "add_to_cart"
    assert result[0]["gap_pct_points"] == pytest.approx(8.0)


def test_ignores_event_types_not_shared():
    # control has "signup_click", variant has "different_event" — no overlap, no divergence reported
    control = _variant("A", {"signup_click": {"count": 50, "rate_per_visitor": 5.0}})
    variant = _variant("B", {"different_event": {"count": 50, "rate_per_visitor": 5.0}})
    result = find_largest_divergence([control, variant])
    assert result == []


def test_sorted_by_absolute_gap_descending():
    control = _variant("A", {
        "step_small_gap": {"count": 100, "rate_per_visitor": 10.0},
        "step_big_gap": {"count": 100, "rate_per_visitor": 10.0},
    })
    variant = _variant("B", {
        "step_small_gap": {"count": 100, "rate_per_visitor": 11.0},   # +1pp
        "step_big_gap": {"count": 100, "rate_per_visitor": 30.0},     # +20pp
    })
    result = find_largest_divergence([control, variant])
    assert result[0]["event_type"] == "step_big_gap"
    assert result[1]["event_type"] == "step_small_gap"


def test_negative_gap_direction_preserved():
    # variant is WORSE than control on this step — gap should be negative, not abs'd away
    control = _variant("A", {"checkout": {"count": 100, "rate_per_visitor": 20.0}})
    variant = _variant("B", {"checkout": {"count": 100, "rate_per_visitor": 12.0}})
    result = find_largest_divergence([control, variant])
    assert result[0]["gap_pct_points"] == pytest.approx(-8.0)


def test_multiple_variants_each_compared_to_control():
    control = _variant("A", {"click": {"count": 100, "rate_per_visitor": 10.0}})
    variant_b = _variant("B", {"click": {"count": 100, "rate_per_visitor": 15.0}})
    variant_c = _variant("C", {"click": {"count": 100, "rate_per_visitor": 5.0}})
    result = find_largest_divergence([control, variant_b, variant_c])
    labels = {r["variant_label"] for r in result}
    assert labels == {"B", "C"}
