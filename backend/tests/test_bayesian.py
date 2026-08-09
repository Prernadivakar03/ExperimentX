"""
Run from backend/ with: pytest tests/test_bayesian.py -v
"""
import pytest
from app.core.bayesian import bayesian_test


def test_needs_at_least_two_variants():
    result = bayesian_test([{"label": "A", "visitors": 100, "conversions": 10}])
    assert "error" in result


def test_returns_one_posterior_per_variant():
    variants = [
        {"label": "A", "visitors": 1000, "conversions": 50},
        {"label": "B", "visitors": 1000, "conversions": 80},
        {"label": "C", "visitors": 1000, "conversions": 60},
    ]
    result = bayesian_test(variants, seed=1, n_samples=20_000)
    assert len(result["variants"]) == 3
    assert {v["label"] for v in result["variants"]} == {"A", "B", "C"}


def test_prob_best_sums_to_one_across_variants():
    variants = [
        {"label": "A", "visitors": 1000, "conversions": 50},
        {"label": "B", "visitors": 1000, "conversions": 80},
    ]
    result = bayesian_test(variants, seed=1, n_samples=20_000)
    total = sum(v["prob_best"] for v in result["variants"])
    assert total == pytest.approx(1.0, abs=0.01)


def test_clear_winner_gets_high_prob_best():
    # B converts 3x A on equal traffic -- should be very clearly the winner
    variants = [
        {"label": "A", "visitors": 5000, "conversions": 100},   # 2%
        {"label": "B", "visitors": 5000, "conversions": 300},   # 6%
    ]
    result = bayesian_test(variants, seed=1, n_samples=50_000)
    assert result["leading_variant"] == "B"
    assert result["leading_prob_best"] > 0.95


def test_identical_variants_split_prob_best_roughly_evenly():
    variants = [
        {"label": "A", "visitors": 2000, "conversions": 200},
        {"label": "B", "visitors": 2000, "conversions": 200},
    ]
    result = bayesian_test(variants, seed=1, n_samples=50_000)
    probs = {v["label"]: v["prob_best"] for v in result["variants"]}
    assert abs(probs["A"] - probs["B"]) < 0.1


def test_expected_loss_is_lowest_for_the_leader():
    variants = [
        {"label": "A", "visitors": 5000, "conversions": 100},
        {"label": "B", "visitors": 5000, "conversions": 300},
    ]
    result = bayesian_test(variants, seed=1, n_samples=50_000)
    losses = {v["label"]: v["expected_loss"] for v in result["variants"]}
    assert losses["B"] < losses["A"]
    assert losses["B"] >= 0  # loss is never negative by construction


def test_credible_interval_is_ordered_and_contains_posterior_mean():
    variants = [
        {"label": "A", "visitors": 1000, "conversions": 100},
        {"label": "B", "visitors": 1000, "conversions": 150},
    ]
    result = bayesian_test(variants, seed=1, n_samples=20_000)
    for v in result["variants"]:
        lo, hi = v["credible_interval_95"]
        assert lo < hi
        assert lo <= v["posterior_mean"] <= hi


def test_massive_sample_size_produces_a_confident_call():
    # With huge, clearly separated samples the test should be ready to call
    variants = [
        {"label": "A", "visitors": 100_000, "conversions": 2_000},   # 2%
        {"label": "B", "visitors": 100_000, "conversions": 6_000},   # 6%
    ]
    result = bayesian_test(variants, seed=1, n_samples=50_000)
    assert result["ready_to_call"] is True


def test_same_seed_is_reproducible():
    variants = [
        {"label": "A", "visitors": 1000, "conversions": 100},
        {"label": "B", "visitors": 1000, "conversions": 120},
    ]
    r1 = bayesian_test(variants, seed=42, n_samples=10_000)
    r2 = bayesian_test(variants, seed=42, n_samples=10_000)
    assert r1 == r2


def test_supports_more_than_two_variants():
    variants = [
        {"label": l, "visitors": 1000, "conversions": c}
        for l, c in zip(["A", "B", "C", "D"], [50, 60, 70, 40])
    ]
    result = bayesian_test(variants, seed=1, n_samples=20_000)
    assert len(result["variants"]) == 4
    assert result["method"] == "beta_binomial_monte_carlo"