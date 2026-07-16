"""
Run from backend/ with: pytest tests/test_phase1_stats_and_bucketing.py -v
Requires: pip install pytest (already covers scipy/numpy via requirements.txt)
"""
import hashlib
import random
import pytest

from app.core.stats import (
    srm_check, multi_variant_test, sample_size_calculator,
    bootstrap_ci, peeking_warning, _benjamini_hochberg,
)


# ── Local copies of the bucketing logic for isolated testing ───────────────
# (The real versions live inline in routes/flags.py and routes/assign.py /
# routes/holdout.py — kept inline there rather than as shared utils. These
# mirror them exactly; if you refactor the real ones into app/core/bucketing.py,
# swap these for a direct import instead.)

def flag_bucket(flag_key: str, visitor_fingerprint: str) -> int:
    h = hashlib.sha256(f"{flag_key}:{visitor_fingerprint}".encode()).hexdigest()
    return int(h[:8], 16) % 100


def group_bucket(fingerprint: str, group_id) -> float:
    h = hashlib.md5(f"{fingerprint}:{group_id}".encode()).hexdigest()
    return (int(h, 16) % 10000) / 100.0


def holdout_bucket(fingerprint: str, group_id) -> float:
    h = hashlib.md5(f"{fingerprint}:{group_id}".encode()).hexdigest()
    return (int(h, 16) % 10000) / 100.0


# ── SRM check ─────────────────────────────────────────────────────────────

def test_srm_no_visitors():
    result = srm_check([{"visitors": 0, "traffic_split": 0.5}, {"visitors": 0, "traffic_split": 0.5}])
    assert result["checked"] is False


def test_srm_balanced_traffic_not_flagged():
    # 5000/5000 on a 50/50 split — should NOT be flagged
    result = srm_check([
        {"visitors": 5012, "traffic_split": 0.5},
        {"visitors": 4988, "traffic_split": 0.5},
    ])
    assert result["checked"] is True
    assert result["mismatched"] is False


def test_srm_detects_real_mismatch():
    # 6500/3500 on a configured 50/50 split — should be flagged, this is a real SRM
    result = srm_check([
        {"visitors": 6500, "traffic_split": 0.5},
        {"visitors": 3500, "traffic_split": 0.5},
    ])
    assert result["checked"] is True
    assert result["mismatched"] is True
    assert result["severity"] in ("medium", "high")


def test_srm_respects_uneven_configured_split():
    # 70/30 configured split, traffic roughly matches 70/30 — should NOT be flagged
    result = srm_check([
        {"visitors": 7020, "traffic_split": 0.7},
        {"visitors": 2980, "traffic_split": 0.3},
    ])
    assert result["mismatched"] is False


# ── Multi-variant test ────────────────────────────────────────────────────

def test_multi_variant_needs_two():
    result = multi_variant_test([{"label": "A", "visitors": 100, "conversions": 10}])
    assert "error" in result


def test_multi_variant_no_visitors():
    result = multi_variant_test([
        {"label": "A", "visitors": 0, "conversions": 0},
        {"label": "B", "visitors": 100, "conversions": 10},
    ])
    assert "error" in result


def test_multi_variant_three_arms_clear_winner():
    # C is a dramatically better variant than A/B — should be significant
    variants = [
        {"label": "A", "visitors": 5000, "conversions": 250},   # 5.0%
        {"label": "B", "visitors": 5000, "conversions": 260},   # 5.2%
        {"label": "C", "visitors": 5000, "conversions": 400},   # 8.0%
    ]
    result = multi_variant_test(variants)
    assert bool(result["overall_significant"]) is True
    assert len(result["pairwise_vs_control"]) == 2  # B and C vs A
    c_result = result["pairwise_vs_control"][1]
    assert c_result["label"] == "C"
    assert bool(c_result["is_significant"]) is True


def test_multi_variant_no_real_difference():
    # All three arms basically identical — should NOT be significant
    variants = [
        {"label": "A", "visitors": 2000, "conversions": 100},
        {"label": "B", "visitors": 2000, "conversions": 102},
        {"label": "C", "visitors": 2000, "conversions": 98},
    ]
    result = multi_variant_test(variants)
    assert bool(result["overall_significant"]) is False


def test_benjamini_hochberg_correction_shrinks_or_equal():
    # BH-adjusted p-values should never be LOWER than raw p-values
    raw = [0.001, 0.02, 0.03, 0.04, 0.049]
    adjusted = _benjamini_hochberg(raw)
    assert len(adjusted) == len(raw)
    for r, a in zip(raw, adjusted):
        assert a >= r - 1e-9


def test_benjamini_hochberg_monotonic_with_rank():
    # Adjusted p-values must be monotonically non-decreasing when sorted by rank
    raw = [0.001, 0.02, 0.03, 0.04, 0.049]
    adjusted = _benjamini_hochberg(raw)
    sorted_pairs = sorted(zip(raw, adjusted))
    adj_sorted = [a for _, a in sorted_pairs]
    assert all(adj_sorted[i] <= adj_sorted[i + 1] + 1e-9 for i in range(len(adj_sorted) - 1))


# ── Sample size calculator ────────────────────────────────────────────────

def test_sample_size_invalid_baseline():
    assert "error" in sample_size_calculator(baseline_rate=1.5, mde=0.1)
    assert "error" in sample_size_calculator(baseline_rate=0, mde=0.1)


def test_sample_size_invalid_mde():
    assert "error" in sample_size_calculator(baseline_rate=0.05, mde=0)


def test_sample_size_known_reference_case():
    # baseline 20%, detect 5pp absolute (25% relative) lift, alpha=0.05, power=0.8.
    # Independently verified by hand (see chat) -> correct answer is 1094/variant.
    result = sample_size_calculator(baseline_rate=0.20, mde=0.25, alpha=0.05, power=0.8)
    assert 1080 <= result["sample_size_per_variant"] <= 1110


def test_sample_size_smaller_mde_needs_more_traffic():
    small_effect = sample_size_calculator(baseline_rate=0.05, mde=0.05, alpha=0.05, power=0.8)
    large_effect = sample_size_calculator(baseline_rate=0.05, mde=0.30, alpha=0.05, power=0.8)
    assert small_effect["sample_size_per_variant"] > large_effect["sample_size_per_variant"]


def test_sample_size_more_variants_scales_total():
    two_arm = sample_size_calculator(baseline_rate=0.05, mde=0.1, variants=2)
    four_arm = sample_size_calculator(baseline_rate=0.05, mde=0.1, variants=4)
    assert four_arm["total_sample_size"] == four_arm["sample_size_per_variant"] * 4
    assert two_arm["sample_size_per_variant"] == four_arm["sample_size_per_variant"]  # per-arm size unaffected by count


# ── Bootstrap CI ───────────────────────────────────────────────────────────

def test_bootstrap_ci_zero_visitors():
    assert "error" in bootstrap_ci(0, 0, 100, 10)


def test_bootstrap_ci_reasonable_range():
    random.seed(42)
    # A: 5% conversion, B: 7.5% conversion -> true lift is +50%
    result = bootstrap_ci(n_a=4000, conv_a=200, n_b=4000, conv_b=300, n_iterations=2000)
    assert "mean_lift_pct" in result
    assert 30 <= result["mean_lift_pct"] <= 70  # should center near +50%, wide tolerance for randomness
    assert result["ci_lower_pct"] < result["mean_lift_pct"] < result["ci_upper_pct"]


def test_bootstrap_ci_no_difference_straddles_zero():
    result = bootstrap_ci(n_a=3000, conv_a=150, n_b=3000, conv_b=151, n_iterations=2000)
    # CI should straddle 0 when there's no real difference
    assert result["ci_lower_pct"] < 0 < result["ci_upper_pct"]


# ── Peeking warning ────────────────────────────────────────────────────────

def test_peeking_no_plan_set():
    result = peeking_warning(current_sample_size=100, planned_sample_size=None,
                              days_running=2, planned_duration_days=None)
    assert result["at_risk"] is False
    assert "reason" in result


def test_peeking_early_stage_flagged():
    result = peeking_warning(current_sample_size=100, planned_sample_size=1000,
                              days_running=1, planned_duration_days=14)
    assert result["at_risk"] is True


def test_peeking_near_complete_not_flagged():
    result = peeking_warning(current_sample_size=950, planned_sample_size=1000,
                              days_running=13, planned_duration_days=14)
    assert result["at_risk"] is False


# ── Bucketing determinism (feature flags, mutual exclusion, holdout) ───────

def test_flag_bucket_deterministic():
    b1 = flag_bucket("new-checkout", "visitor-abc-123")
    b2 = flag_bucket("new-checkout", "visitor-abc-123")
    assert b1 == b2
    assert 0 <= b1 < 100


def test_flag_bucket_different_visitors_spread_out():
    buckets = [flag_bucket("new-checkout", f"visitor-{i}") for i in range(2000)]
    # rough uniformity check: no bucket should dominate
    from collections import Counter
    counts = Counter(buckets)
    assert max(counts.values()) < 2000 * 0.05  # no single bucket >5% of traffic


def test_flag_bucket_rollout_percentage_distribution():
    # simulate a 30% rollout across 5000 visitors -> should land near 30%, not exact
    buckets = [flag_bucket("my-flag", f"user-{i}") for i in range(5000)]
    enabled = sum(1 for b in buckets if b < 30)
    pct = enabled / 5000 * 100
    assert 26 <= pct <= 34  # tolerance band around the target 30%


def test_group_bucket_stable_across_experiments_in_group():
    # Same visitor, same group -> same bucket regardless of which experiment they hit first
    fingerprint = "visitor-xyz"
    group_id = "group-homepage-layer"
    b1 = group_bucket(fingerprint, group_id)
    b2 = group_bucket(fingerprint, group_id)
    assert b1 == b2


def test_mutual_exclusion_no_visitor_in_two_experiments():
    # Simulate 3 experiments in a group with 30/30/30 allocation, 10% unused.
    # For each of 3000 simulated visitors, confirm exactly one owning experiment (or none).
    memberships = [("exp_A", 30), ("exp_B", 30), ("exp_C", 30)]
    group_id = "group-1"

    owners = []
    for i in range(3000):
        fp = f"visitor-{i}"
        bucket = group_bucket(fp, group_id)
        cumulative = 0
        owner = None
        for label, pct in memberships:
            cumulative += pct
            if bucket < cumulative:
                owner = label
                break
        owners.append(owner)

    # Every visitor gets AT MOST one owner (guaranteed by construction, but verify shape)
    assert all(o in ("exp_A", "exp_B", "exp_C", None) for o in owners)
    # Roughly 30% each, ~10% None, within tolerance
    from collections import Counter
    counts = Counter(owners)
    for label in ("exp_A", "exp_B", "exp_C"):
        pct = counts[label] / 3000 * 100
        assert 25 <= pct <= 35
    none_pct = counts[None] / 3000 * 100
    assert 6 <= none_pct <= 14


def test_holdout_bucket_matches_configured_percentage():
    group_id = "holdout-1"
    percentage = 10
    in_holdout = sum(
        1 for i in range(5000) if holdout_bucket(f"visitor-{i}", group_id) < percentage
    )
    pct = in_holdout / 5000 * 100
    assert 8 <= pct <= 12
