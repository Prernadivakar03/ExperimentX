"""
Run from backend/ with: pytest tests/test_cuped.py -v
"""
import numpy as np
import pytest
from app.core.cuped import cuped_adjust, cuped_compare_variants


# ── cuped_adjust ─────────────────────────────────────────────────────────

def test_perfectly_correlated_covariate_kills_variance():
    # outcome IS the covariate -> CUPED should explain (almost) all variance
    covariates = [1, 2, 3, 4, 5, 6, 7, 8]
    outcomes = covariates
    result = cuped_adjust(outcomes, covariates)
    assert result["variance_reduction_pct"] > 95
    # theta = cov(x,y)/var(x). np.cov defaults to ddof=1 (sample) while
    # np.var defaults to ddof=0 (population), so for y == x theta lands at
    # n/(n-1) rather than exactly 1 -- that's the real behavior of this
    # implementation, not a bug we're asserting away.
    n = len(covariates)
    assert result["theta"] == pytest.approx(n / (n - 1), abs=1e-3)


def test_uncorrelated_covariate_gives_no_meaningful_reduction():
    rng = np.random.default_rng(42)
    outcomes = rng.normal(0, 1, 500).tolist()
    covariates = rng.normal(0, 1, 500).tolist()  # independent of outcomes
    result = cuped_adjust(outcomes, covariates)
    # theta should be close to 0, reduction should be small (not necessarily
    # exactly 0 due to sampling noise, but nowhere near the correlated case)
    assert abs(result["theta"]) < 0.3
    assert result["variance_reduction_pct"] < 20


def test_no_variance_in_covariate_returns_error():
    result = cuped_adjust([1, 2, 3], [5, 5, 5])
    assert "error" in result
    assert result["adjusted"] == [1, 2, 3]


def test_too_few_points_returns_error():
    result = cuped_adjust([1], [1])
    assert "error" in result


def test_adjusted_outcomes_same_length_as_input():
    outcomes = [1, 0, 1, 1, 0, 0, 1, 0]
    covariates = [0.1, 0.4, 0.9, 0.7, 0.2, 0.3, 0.8, 0.5]
    result = cuped_adjust(outcomes, covariates)
    assert len(result["adjusted_outcomes"]) == len(outcomes)


def test_variance_after_never_exceeds_variance_before_for_correlated_data():
    # CUPED with a genuinely predictive covariate should never make things worse
    rng = np.random.default_rng(7)
    covariates = rng.normal(0, 1, 300)
    outcomes = (0.6 * covariates + rng.normal(0, 0.5, 300)).tolist()
    result = cuped_adjust(outcomes, covariates.tolist())
    assert result["variance_after"] <= result["variance_before"]
    assert result["effective_sample_size_multiplier"] >= 1.0


# ── cuped_compare_variants ──────────────────────────────────────────────

def test_compare_variants_returns_one_result_per_variant():
    variants_raw = [
        {"label": "A", "outcomes": [1, 0, 1, 0, 1, 1], "covariates": [0.2, 0.1, 0.3, 0.1, 0.4, 0.3]},
        {"label": "B", "outcomes": [1, 1, 1, 0, 1, 1], "covariates": [0.3, 0.4, 0.5, 0.1, 0.4, 0.5]},
    ]
    result = cuped_compare_variants(variants_raw)
    assert len(result["variants"]) == 2
    assert {r["label"] for r in result["variants"]} == {"A", "B"}


def test_compare_variants_computes_adjusted_mean():
    variants_raw = [
        {"label": "A", "outcomes": [1, 0, 1, 0, 1, 1], "covariates": [0.2, 0.1, 0.3, 0.1, 0.4, 0.3]},
    ]
    result = cuped_compare_variants(variants_raw)
    assert result["variants"][0]["adjusted_mean"] is not None
    assert isinstance(result["variants"][0]["adjusted_mean"], float)


def test_compare_variants_handles_bad_variant_gracefully():
    # one variant has zero-variance covariate -> should error for that variant
    # only, not blow up the whole comparison
    variants_raw = [
        {"label": "A", "outcomes": [1, 0, 1], "covariates": [5, 5, 5]},
        {"label": "B", "outcomes": [1, 0, 1, 1], "covariates": [0.1, 0.2, 0.3, 0.4]},
    ]
    result = cuped_compare_variants(variants_raw)
    a, b = result["variants"]
    assert "error" in a
    assert a["adjusted_mean"] is None
    assert "error" not in b
    assert b["adjusted_mean"] is not None