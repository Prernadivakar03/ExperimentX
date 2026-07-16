"""
Statistical engine extensions: SRM check, multi-variant significance test,
sample-size calculator, bootstrap confidence intervals, peeking warning.

Builds on top of the existing two-proportion z-test in routes/analytics.py.
"""
import math
import numpy as np
from scipy.stats import chi2_contingency, chi2, norm


# ── 1. Sample Ratio Mismatch (SRM) check ────────────────────────────────────

def srm_check(variants: list[dict], threshold: float = 0.01) -> dict:
    """
    Checks whether observed visitor counts match the configured traffic_split.
    variants: [{"label": "A", "visitors": 5000, "traffic_split": 0.5}, ...]
    threshold: p-value below which we flag a mismatch (0.01 is standard for SRM,
               stricter than the usual 0.05 because SRM checks run constantly).
    """
    total_visitors = sum(v["visitors"] for v in variants)
    if total_visitors == 0:
        return {"checked": False, "reason": "No visitors yet"}

    observed = [v["visitors"] for v in variants]
    expected = [total_visitors * v["traffic_split"] for v in variants]

    if any(e == 0 for e in expected):
        return {"checked": False, "reason": "Invalid traffic split (0%)"}

    chi_sq = sum((o - e) ** 2 / e for o, e in zip(observed, expected))
    dof = len(variants) - 1
    p_value = float(chi2.sf(chi_sq, dof))

    mismatched = p_value < threshold

    return {
        "checked": True,
        "chi_square": round(chi_sq, 4),
        "p_value": round(p_value, 6),
        "mismatched": mismatched,
        "severity": "high" if p_value < 0.001 else ("medium" if mismatched else "none"),
        "message": (
            "Traffic split doesn't match configuration — check randomization, "
            "bot filtering, or a broken variant."
            if mismatched else "Traffic split looks healthy."
        ),
    }


# ── 2. Multi-variant significance test (A/B/C/…/n) ──────────────────────────

def multi_variant_test(variants: list[dict]) -> dict:
    """
    Chi-square test of independence across N variants (N >= 2).
    variants: [{"label": "A", "visitors": 5000, "conversions": 250}, ...]
    Returns overall significance + pairwise comparisons vs control (first variant)
    with Benjamini-Hochberg correction applied to the pairwise p-values.
    """
    if len(variants) < 2:
        return {"error": "Need at least 2 variants"}

    if any(v["visitors"] == 0 for v in variants):
        return {"error": "Not enough visitors to compute significance"}

    # Contingency table: rows = variants, cols = [converted, not_converted]
    table = [
        [v["conversions"], v["visitors"] - v["conversions"]]
        for v in variants
    ]

    chi_sq, p_value, dof, _ = chi2_contingency(table)

    control = variants[0]
    pairwise = []
    raw_p_values = []

    for v in variants[1:]:
        z_result = _pairwise_z_test(control, v)
        pairwise.append(z_result)
        raw_p_values.append(z_result["p_value"])

    corrected = _benjamini_hochberg(raw_p_values)
    for pw, adj_p in zip(pairwise, corrected):
        pw["p_value_adjusted"] = round(adj_p, 6)
        pw["is_significant_adjusted"] = adj_p < 0.05

    return {
        "overall_chi_square": round(float(chi_sq), 4),
        "overall_p_value": round(float(p_value), 6),
        "overall_significant": p_value < 0.05,
        "control_label": control["label"],
        "pairwise_vs_control": pairwise,
        "correction_method": "benjamini_hochberg",
    }


def _pairwise_z_test(a: dict, b: dict) -> dict:
    n_a, conv_a = a["visitors"], a["conversions"]
    n_b, conv_b = b["visitors"], b["conversions"]

    p_a = conv_a / n_a
    p_b = conv_b / n_b
    p_pool = (conv_a + conv_b) / (n_a + n_b)

    denom = math.sqrt(p_pool * (1 - p_pool) * (1 / n_a + 1 / n_b))
    if denom == 0:
        return {"label": b["label"], "error": "No conversions yet"}

    z = (p_b - p_a) / denom
    p_value = 2 * (1 - norm.cdf(abs(z)))
    lift = ((p_b - p_a) / p_a * 100) if p_a > 0 else None

    return {
        "label": b["label"],
        "z_score": round(z, 4),
        "p_value": round(p_value, 6),
        "lift_pct": round(lift, 2) if lift is not None else None,
        "is_significant": p_value < 0.05,
    }


def _benjamini_hochberg(p_values: list[float]) -> list[float]:
    """Benjamini-Hochberg FDR correction. Returns adjusted p-values, same order as input."""
    n = len(p_values)
    if n == 0:
        return []

    indexed = sorted(enumerate(p_values), key=lambda x: x[1])
    adjusted = [0.0] * n
    prev = 1.0

    for rank, (orig_idx, p) in reversed(list(enumerate(indexed, start=1))):
        adj = min(prev, p * n / rank)
        adjusted[orig_idx] = adj
        prev = adj

    return adjusted


# ── 3. Sample size / power calculator ────────────────────────────────────────

def sample_size_calculator(
    baseline_rate: float,
    mde: float,
    alpha: float = 0.05,
    power: float = 0.8,
    variants: int = 2,
) -> dict:
    """
    baseline_rate: current conversion rate, e.g. 0.05 for 5%
    mde: minimum detectable effect, RELATIVE, e.g. 0.10 for a 10% relative lift
    Returns required sample size per variant.
    """
    if not (0 < baseline_rate < 1):
        return {"error": "baseline_rate must be between 0 and 1"}
    if mde <= 0:
        return {"error": "mde must be positive"}

    p1 = baseline_rate
    p2 = baseline_rate * (1 + mde)
    p2 = min(p2, 0.999)

    z_alpha = norm.ppf(1 - alpha / 2)
    z_beta = norm.ppf(power)

    p_bar = (p1 + p2) / 2
    numerator = (
        z_alpha * math.sqrt(2 * p_bar * (1 - p_bar))
        + z_beta * math.sqrt(p1 * (1 - p1) + p2 * (1 - p2))
    ) ** 2
    denominator = (p2 - p1) ** 2

    n_per_variant = math.ceil(numerator / denominator)
    total = n_per_variant * variants

    return {
        "baseline_rate": baseline_rate,
        "target_rate": round(p2, 4),
        "mde_relative": mde,
        "alpha": alpha,
        "power": power,
        "sample_size_per_variant": n_per_variant,
        "total_sample_size": total,
    }


# ── 4. Bootstrap confidence interval for lift ────────────────────────────────

def bootstrap_ci(
    n_a: int, conv_a: int,
    n_b: int, conv_b: int,
    n_iterations: int = 10000,
    confidence: float = 0.95,
) -> dict:
    """
    Non-parametric bootstrap CI for relative lift of B over A.
    Doesn't assume normality — robust when sample sizes are small/skewed.
    """
    if n_a == 0 or n_b == 0:
        return {"error": "Not enough visitors to bootstrap"}

    rng = np.random.default_rng()
    arr_a = np.zeros(n_a); arr_a[:conv_a] = 1
    arr_b = np.zeros(n_b); arr_b[:conv_b] = 1

    lifts = []
    for _ in range(n_iterations):
        sample_a = rng.choice(arr_a, size=n_a, replace=True)
        sample_b = rng.choice(arr_b, size=n_b, replace=True)
        rate_a = sample_a.mean()
        rate_b = sample_b.mean()
        if rate_a > 0:
            lifts.append((rate_b - rate_a) / rate_a * 100)

    if not lifts:
        return {"error": "Could not compute — no conversions in resamples"}

    lower_pct = (1 - confidence) / 2 * 100
    upper_pct = (1 - lower_pct / 100) * 100
    lifts = np.array(lifts)

    return {
        "mean_lift_pct": round(float(np.mean(lifts)), 2),
        "ci_lower_pct": round(float(np.percentile(lifts, lower_pct)), 2),
        "ci_upper_pct": round(float(np.percentile(lifts, 100 - lower_pct)), 2),
        "confidence_level": confidence,
        "iterations": n_iterations,
    }


# ── 5. Early-peeking risk warning ───────────────────────────────────────────

def peeking_warning(
    current_sample_size: int,
    planned_sample_size: int | None,
    days_running: int,
    planned_duration_days: int | None,
) -> dict:
    """
    Not a full alpha-spending correction — a honest heads-up that results
    checked before the planned sample/duration are directional, not final.
    """
    sample_pct = None
    duration_pct = None

    if planned_sample_size and planned_sample_size > 0:
        sample_pct = round(current_sample_size / planned_sample_size * 100, 1)
    if planned_duration_days and planned_duration_days > 0:
        duration_pct = round(days_running / planned_duration_days * 100, 1)

    progress_values = [p for p in [sample_pct, duration_pct] if p is not None]
    if not progress_values:
        return {"at_risk": False, "reason": "No planned sample/duration set"}

    min_progress = min(progress_values)
    at_risk = min_progress < 80

    return {
        "at_risk": at_risk,
        "sample_progress_pct": sample_pct,
        "duration_progress_pct": duration_pct,
        "message": (
            f"Only {min_progress}% of the way to your planned sample/duration — "
            "treat any 'significant' result now as directional, not final. "
            "Stopping early inflates the chance of a false positive."
            if at_risk else "Sample/duration progress is far enough along to trust the result."
        ),
    }