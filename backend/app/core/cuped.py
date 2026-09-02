"""
CUPED (Controlled-experiment Using Pre-Experiment Data), Microsoft's 2013
variance-reduction technique. Adjusts each visitor's outcome using a
pre-experiment covariate (their historical behavior) to strip out variance
that has nothing to do with the treatment — typically cuts required sample
size by 20-50% with zero extra traffic cost.

Requires a pre-period covariate per visitor (e.g. pre-experiment conversion
rate, page views, or spend in the N days before they entered the experiment).
Store this at assignment time in Visitor.pre_experiment_covariate.
"""
import numpy as np
from scipy.stats import ttest_ind


def cuped_adjust(
    outcomes: list[float],       # e.g. binary conversion 0/1, or revenue per visitor
    covariates: list[float],     # pre-experiment value for the SAME metric, per visitor
) -> dict:
    """
    Returns CUPED-adjusted outcomes plus the variance reduction achieved.
    outcomes and covariates must be same length, same visitor order.
    """
    y = np.array(outcomes, dtype=float)
    x = np.array(covariates, dtype=float)

    if len(y) < 2 or np.var(x) == 0:
        return {"error": "Not enough data or no variance in covariate", "adjusted": outcomes}

    theta = np.cov(x, y)[0, 1] / np.var(x)  # optimal adjustment coefficient
    y_adjusted = y - theta * (x - np.mean(x))

    var_before = np.var(y)
    var_after = np.var(y_adjusted)
    reduction_pct = (1 - var_after / var_before) * 100 if var_before > 0 else 0.0

    return {
        "adjusted_outcomes": y_adjusted.tolist(),
        "theta": round(float(theta), 4),
        "variance_before": round(float(var_before), 6),
        "variance_after": round(float(var_after), 6),
        "variance_reduction_pct": round(float(reduction_pct), 2),
        "effective_sample_size_multiplier": round(
            float(var_before / var_after) if var_after > 0 else 1.0, 2
        ),
    }


def cuped_compare_variants(variants_raw: list[dict]) -> dict:
    """
    variants_raw: [{"label": "A", "outcomes": [...], "covariates": [...]}, ...]
    Applies CUPED per variant, then reruns the mean comparison on adjusted data.
    Plug the adjusted outcomes back into stats.multi_variant_test-style logic
    for tighter confidence intervals on the same traffic.
    """
    results = []
    for v in variants_raw:
        r = cuped_adjust(v["outcomes"], v["covariates"])
        r["label"] = v["label"]
        r["adjusted_mean"] = round(float(np.mean(r["adjusted_outcomes"])), 4) if "adjusted_outcomes" in r else None
        results.append(r)
    return {"variants": results}


def cuped_two_variant_test(
    a_outcomes: list[float], a_covariates: list[float],
    b_outcomes: list[float], b_covariates: list[float],
    alpha: float = 0.05,
) -> dict:
    """
    CUPED-adjusts both variants using a SINGLE theta estimated on the
    pooled data across both arms -- the standard approach. Estimating
    theta separately per variant would let the adjustment itself introduce
    a difference between arms that wasn't in the raw data, defeating the
    point of a variance-reduction technique that's supposed to be neutral
    w.r.t. treatment.

    Runs Welch's t-test (doesn't assume equal variance) on the adjusted
    outcomes rather than reusing the raw-proportions z-test -- CUPED
    output is continuous, not binomial, once adjusted.
    """
    y_a = np.array(a_outcomes, dtype=float)
    x_a = np.array(a_covariates, dtype=float)
    y_b = np.array(b_outcomes, dtype=float)
    x_b = np.array(b_covariates, dtype=float)

    if len(y_a) < 2 or len(y_b) < 2:
        return {"available": False, "reason": "Not enough visitors with pre-experiment covariate data"}

    y_all = np.concatenate([y_a, y_b])
    x_all = np.concatenate([x_a, x_b])
    if np.var(x_all) == 0:
        return {"available": False, "reason": "No variance in the covariate — CUPED can't reduce variance here"}

    theta = np.cov(x_all, y_all)[0, 1] / np.var(x_all)
    x_mean = np.mean(x_all)

    y_a_adj = y_a - theta * (x_a - x_mean)
    y_b_adj = y_b - theta * (x_b - x_mean)

    var_before = np.var(y_all)
    var_after = np.var(np.concatenate([y_a_adj, y_b_adj]))
    reduction_pct = (1 - var_after / var_before) * 100 if var_before > 0 else 0.0

    t_stat, p_value = ttest_ind(y_b_adj, y_a_adj, equal_var=False)

    return {
        "available": True,
        "theta": round(float(theta), 4),
        "variance_reduction_pct": round(float(reduction_pct), 2),
        "n_a": len(y_a),
        "n_b": len(y_b),
        "adjusted_mean_a": round(float(np.mean(y_a_adj)), 4),
        "adjusted_mean_b": round(float(np.mean(y_b_adj)), 4),
        "t_statistic": round(float(t_stat), 4),
        "p_value": round(float(p_value), 6),
        "is_significant": bool(p_value < alpha),
    }