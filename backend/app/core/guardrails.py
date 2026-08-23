# backend/app/core/guardrails.py
"""
Guardrail regression check: compares a guardrail metric's value for a
variant against the control (variants[0] — same convention core/stats.py
already uses for pairwise comparisons), and reports whether it regressed
past the configured threshold.
"""
from typing import Literal


def check_guardrail_regression(
    control_value: float,
    variant_value: float,
    direction: Literal["higher_is_better", "lower_is_better"],
    max_regression_pct: float,
) -> tuple[bool, float, str]:
    """
    Returns (regressed, pct_change, detail). pct_change is signed:
    negative = the metric went down, positive = it went up.
    """
    if control_value == 0:
        return False, 0.0, "no control baseline yet — skipping guardrail check"

    pct_change = (variant_value - control_value) / abs(control_value) * 100

    if direction == "higher_is_better":
        regressed = pct_change <= -max_regression_pct   # a drop is bad
    else:
        regressed = pct_change >= max_regression_pct     # a rise is bad

    detail = (
        f"changed {pct_change:+.1f}% vs control "
        f"(control={control_value:.4f}, variant={variant_value:.4f}, "
        f"threshold={max_regression_pct:.1f}%)"
    )
    return regressed, pct_change, detail