"""
Run from backend/ with: pytest tests/test_sequential.py -v
"""
import pytest
from app.core.sequential import msprt_test, msprt_multi_variant


# ── msprt_test ────────────────────────────────────────────────────────────

def test_zero_visitors_in_control_returns_error():
    result = msprt_test(0, 0, 100, 10)
    assert "error" in result


def test_zero_visitors_in_variant_returns_error():
    result = msprt_test(100, 10, 0, 0)
    assert "error" in result


def test_no_conversions_anywhere_returns_error():
    # pooled conversion rate of 0 -> no variance yet, can't test
    result = msprt_test(100, 0, 100, 0)
    assert "error" in result


def test_everyone_converts_returns_error():
    # pooled conversion rate of 1 -> no variance, same issue as above
    result = msprt_test(100, 100, 100, 100)
    assert "error" in result


def test_result_always_carries_safe_to_peek_flag():
    result = msprt_test(1000, 100, 1000, 120)
    assert result["safe_to_peek"] is True


def test_no_difference_is_not_significant():
    result = msprt_test(1000, 100, 1000, 100)
    assert result["significant_now"] is False
    assert result["z_score"] == pytest.approx(0.0, abs=1e-9)


def test_large_clear_effect_is_significant():
    # 2% vs 10% conversion on large samples is an enormous, obvious effect
    result = msprt_test(5000, 100, 5000, 500)
    assert result["significant_now"] is True
    assert result["always_valid_p_value"] < 0.05


def test_z_score_sign_matches_direction_of_effect():
    better = msprt_test(1000, 50, 1000, 100)   # variant beats control
    worse = msprt_test(1000, 100, 1000, 50)    # variant loses to control
    assert better["z_score"] > 0
    assert worse["z_score"] < 0


def test_always_valid_p_value_bounded_between_0_and_1():
    result = msprt_test(2000, 150, 2000, 220)
    assert 0.0 <= result["always_valid_p_value"] <= 1.0


def test_tau_changes_sensitivity_but_result_stays_well_formed():
    # tau controls how aggressively the test looks for an effect. The exact
    # relationship between tau and the likelihood ratio isn't monotonic for
    # every z-score, so we just assert both configurations produce valid,
    # well-formed results rather than assuming a direction.
    small_tau = msprt_test(3000, 150, 3000, 250, tau=0.001)
    large_tau = msprt_test(3000, 150, 3000, 250, tau=0.05)
    for result in (small_tau, large_tau):
        assert result["likelihood_ratio"] > 0
        assert 0.0 <= result["always_valid_p_value"] <= 1.0
    # both should agree on direction since it's the same underlying data
    assert small_tau["z_score"] == large_tau["z_score"]


# ── msprt_multi_variant ──────────────────────────────────────────────────

def test_multi_variant_runs_one_comparison_per_variant():
    control = {"label": "control", "visitors": 2000, "conversions": 100}
    variants = [
        {"label": "A", "visitors": 2000, "conversions": 110},
        {"label": "B", "visitors": 2000, "conversions": 250},
    ]
    result = msprt_multi_variant(control, variants)
    assert result["control_label"] == "control"
    assert len(result["comparisons"]) == 2
    assert {c["label"] for c in result["comparisons"]} == {"A", "B"}


def test_multi_variant_flags_the_clear_winner_significant():
    control = {"label": "control", "visitors": 5000, "conversions": 100}
    variants = [
        {"label": "flat", "visitors": 5000, "conversions": 102},
        {"label": "big_winner", "visitors": 5000, "conversions": 500},
    ]
    result = msprt_multi_variant(control, variants)
    by_label = {c["label"]: c for c in result["comparisons"]}
    assert by_label["flat"]["significant_now"] is False
    assert by_label["big_winner"]["significant_now"] is True