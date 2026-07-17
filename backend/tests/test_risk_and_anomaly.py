"""
Run from backend/ with: pytest tests/test_risk_and_anomaly.py -v
"""
import pytest
from app.core.risk_score import compute_risk_signals
from app.core.anomaly import detect_traffic_anomaly


# ── Risk score ───────────────────────────────────────────────────────────

def test_healthy_experiment_is_low_risk():
    result = compute_risk_signals(
        num_variants=2, traffic_pct=100, duration_days=14,
        current_sample_size=8000, target_sample_size=10000,
        is_in_mutual_exclusion_group=True, srm_flagged=False,
        has_guardrail_metric=True,
    )
    assert result["risk_level"] == "low"
    assert result["risk_score"] < 25
    assert result["signals"] == []


def test_short_duration_flagged():
    result = compute_risk_signals(
        num_variants=2, traffic_pct=100, duration_days=3,
        current_sample_size=8000, target_sample_size=10000,
        is_in_mutual_exclusion_group=True, srm_flagged=False,
        has_guardrail_metric=True,
    )
    assert result["risk_score"] >= 25
    assert any("Duration" in s for s in result["signals"])


def test_srm_flagged_is_heavily_weighted():
    baseline = compute_risk_signals(
        num_variants=2, traffic_pct=100, duration_days=14,
        current_sample_size=8000, target_sample_size=10000,
        is_in_mutual_exclusion_group=True, srm_flagged=False,
        has_guardrail_metric=True,
    )
    with_srm = compute_risk_signals(
        num_variants=2, traffic_pct=100, duration_days=14,
        current_sample_size=8000, target_sample_size=10000,
        is_in_mutual_exclusion_group=True, srm_flagged=True,
        has_guardrail_metric=True,
    )
    assert with_srm["risk_score"] > baseline["risk_score"]
    assert with_srm["risk_score"] - baseline["risk_score"] == 30


def test_no_target_sample_size_flagged():
    result = compute_risk_signals(
        num_variants=2, traffic_pct=100, duration_days=14,
        current_sample_size=8000, target_sample_size=None,
        is_in_mutual_exclusion_group=True, srm_flagged=False,
        has_guardrail_metric=True,
    )
    assert any("No target sample size" in s for s in result["signals"])


def test_everything_wrong_is_high_risk():
    result = compute_risk_signals(
        num_variants=5, traffic_pct=5, duration_days=2,
        current_sample_size=100, target_sample_size=10000,
        is_in_mutual_exclusion_group=False, srm_flagged=True,
        has_guardrail_metric=False,
    )
    assert result["risk_level"] == "high"
    assert result["risk_score"] == 100  # capped, even though raw sum exceeds 100


def test_score_never_exceeds_100():
    result = compute_risk_signals(
        num_variants=10, traffic_pct=1, duration_days=1,
        current_sample_size=1, target_sample_size=1000000,
        is_in_mutual_exclusion_group=False, srm_flagged=True,
        has_guardrail_metric=False,
    )
    assert result["risk_score"] <= 100


# ── Anomaly detection ────────────────────────────────────────────────────

def test_insufficient_data():
    result = detect_traffic_anomaly([100, 105, 98])
    assert result["checked"] is False


def test_normal_traffic_not_flagged():
    # stable traffic around 1000/day, today is 1020 — well within normal noise
    result = detect_traffic_anomaly([980, 1010, 995, 1005, 990, 1020])
    assert result["anomalous"] is False


def test_traffic_drop_flagged():
    # stable ~1000/day baseline, today crashes to 50 — should be flagged
    result = detect_traffic_anomaly([980, 1010, 995, 1005, 990, 50])
    assert result["anomalous"] is True
    assert result["direction"] == "drop"


def test_traffic_spike_flagged():
    result = detect_traffic_anomaly([980, 1010, 995, 1005, 990, 8000])
    assert result["anomalous"] is True
    assert result["direction"] == "spike"


def test_flat_baseline_any_deviation_flagged():
    # exactly 500/day for 5 days straight, then 501 — even a tiny deviation
    # from a perfectly flat baseline is notable (stdev=0 edge case)
    result = detect_traffic_anomaly([500, 500, 500, 500, 501])
    assert result["anomalous"] is True


def test_flat_baseline_no_deviation_not_flagged():
    result = detect_traffic_anomaly([500, 500, 500, 500, 500])
    assert result["anomalous"] is False
