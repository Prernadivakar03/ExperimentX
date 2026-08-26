# backend/app/core/guardrails.py
"""
Guardrail regression check: compares a guardrail metric's value for a
variant against the control (variants[0] — same convention core/stats.py
already uses for pairwise comparisons).

A guardrail should NOT auto-pause an experiment just because a variant is
numerically worse — with small samples, normal noise routinely produces
10-20% swings that mean nothing. This requires BOTH:
  1. A minimum sample size per arm, so we're not reacting to 8 visitors.
  2. For conversion-rate metrics, statistical significance of the
     regression (a real z-test), not just "the number went down."

For non-rate metric types (sum/average/ratio/custom formula) we don't have
a clean per-visitor distribution to run a formal significance test on
without a bigger redesign — those still use the sample-size gate plus the
raw threshold, and this is called out explicitly rather than silently
pretending it's equally rigorous.
"""
from typing import Literal, Optional

from app.core.stats import two_proportion_z_test

MIN_GUARDRAIL_SAMPLE_SIZE = 100  # per arm, before a guardrail can fire at all


def check_guardrail_regression(
    control_value: float,
    variant_value: float,
    direction: Literal["higher_is_better", "lower_is_better"],
    max_regression_pct: float,
    metric_type: Optional[str] = None,
    control_visitors: Optional[int] = None,
    variant_visitors: Optional[int] = None,
    control_conversions: Optional[int] = None,
    variant_conversions: Optional[int] = None,
    alpha: float = 0.05,
) -> tuple[bool, float, str]:
    """
    Returns (regressed, pct_change, detail). pct_change is signed:
    negative = the metric went down, positive = it went up.

    Backward compatible: if visitor/conversion counts aren't passed, falls
    back to the old threshold-only behavior (used by any caller that
    hasn't been updated yet).
    """
    if control_value == 0:
        return False, 0.0, "no control baseline yet — skipping guardrail check"

    pct_change = (variant_value - control_value) / abs(control_value) * 100

    if direction == "higher_is_better":
        raw_regressed = pct_change <= -max_regression_pct
    else:
        raw_regressed = pct_change >= max_regression_pct

    if not raw_regressed:
        return False, pct_change, (
            f"changed {pct_change:+.1f}% vs control "
            f"(control={control_value:.4f}, variant={variant_value:.4f}, "
            f"threshold={max_regression_pct:.1f}%) — within threshold"
        )

    # Past this point the raw change exceeds the configured threshold —
    # now check whether we actually have enough evidence to trust it.

    if control_visitors is not None and variant_visitors is not None:
        if control_visitors < MIN_GUARDRAIL_SAMPLE_SIZE or variant_visitors < MIN_GUARDRAIL_SAMPLE_SIZE:
            return False, pct_change, (
                f"changed {pct_change:+.1f}% vs control, past the {max_regression_pct:.1f}% threshold, "
                f"but sample size is too small to trust yet "
                f"(control={control_visitors}, variant={variant_visitors}, need {MIN_GUARDRAIL_SAMPLE_SIZE}+ each) — monitoring only"
            )

    # Enough traffic to check for statistical significance, not just a
    # threshold crossing. Only formally testable for conversion-rate
    # metrics, where we have visitor/conversion counts to run a real
    # two-proportion z-test.
    if metric_type == "conversion_rate" and None not in (control_visitors, variant_visitors, control_conversions, variant_conversions):
        test = two_proportion_z_test(control_visitors, control_conversions, variant_visitors, variant_conversions, alpha=alpha)
        if "error" in test:
            return False, pct_change, f"changed {pct_change:+.1f}% vs control, but not enough data to test significance yet"

        if not test["is_significant"]:
            return False, pct_change, (
                f"changed {pct_change:+.1f}% vs control, past the {max_regression_pct:.1f}% threshold, "
                f"but not statistically significant yet (p={test['p_value']:.4f}) — likely noise, monitoring only"
            )

        return True, pct_change, (
            f"changed {pct_change:+.1f}% vs control, past the {max_regression_pct:.1f}% threshold "
            f"and statistically significant (p={test['p_value']:.4f}, control={control_value:.4f}, variant={variant_value:.4f})"
        )

    # Non-rate metric, or counts weren't provided: sample-size-gated
    # threshold check only — explicitly labeled as such rather than
    # implying it's been significance-tested.
    return True, pct_change, (
        f"changed {pct_change:+.1f}% vs control "
        f"(control={control_value:.4f}, variant={variant_value:.4f}, threshold={max_regression_pct:.1f}%) "
        f"— threshold-based only, not statistically tested for this metric type"
    )