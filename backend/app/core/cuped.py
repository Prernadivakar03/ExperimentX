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