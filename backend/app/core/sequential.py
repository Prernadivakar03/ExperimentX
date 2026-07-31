"""
Always-valid inference via mixture Sequential Probability Ratio Test (mSPRT).
Unlike the fixed z-test, the significance threshold here stays valid no
matter how many times or when you check it — this is what makes continuous
peeking statistically safe. Based on Johari et al. (2017), "Peeking at A/B
Tests" (Optimizely's approach).
"""
import math


def msprt_test(
    n_control: int, conv_control: int,
    n_variant: int, conv_variant: int,
    tau: float = 0.01,        # mixing variance — controls test sensitivity, 0.01 is a reasonable default
    alpha: float = 0.05,
) -> dict:
    """
    Always-valid p-value for a single control-vs-variant comparison.
    Can be called repeatedly as data accumulates — no correction needed.
    """
    if n_control == 0 or n_variant == 0:
        return {"error": "Not enough visitors"}

    p_c = conv_control / n_control
    p_v = conv_variant / n_variant
    n = n_control + n_variant

    # Effective sample-size weighted difference (approx normal test statistic)
    pooled = (conv_control + conv_variant) / n
    if pooled == 0 or pooled == 1:
        return {"error": "No variance in the data yet"}

    se = math.sqrt(pooled * (1 - pooled) * (1 / n_control + 1 / n_variant))
    z = (p_v - p_c) / se if se > 0 else 0.0

    # mSPRT likelihood ratio under a normal mixture prior N(0, tau)
    # Λ_n = sqrt(sigma^2 / (sigma^2 + n*tau)) * exp( n^2*tau*z^2 / (2*sigma^2*(sigma^2+n*tau)) )
    sigma2 = 1.0
    denom = sigma2 + n * tau
    log_lambda = 0.5 * math.log(sigma2 / denom) + (n * tau * (z ** 2)) / (2 * denom)
    likelihood_ratio = math.exp(min(log_lambda, 700))  # avoid overflow

    always_valid_p = min(1.0, 1.0 / likelihood_ratio) if likelihood_ratio > 0 else 1.0
    significant_now = likelihood_ratio > (1 / alpha)

    return {
        "z_score": round(z, 4),
        "likelihood_ratio": round(likelihood_ratio, 4),
        "always_valid_p_value": round(always_valid_p, 6),
        "significant_now": significant_now,
        "safe_to_peek": True,
        "message": (
            "Result is significant AND safe to act on right now — this test "
            "stays valid no matter when you checked it."
            if significant_now else
            "Not yet significant under always-valid inference — keep collecting, "
            "no penalty for having checked early."
        ),
    }


def msprt_multi_variant(control: dict, variants: list[dict], tau: float = 0.01, alpha: float = 0.05) -> dict:
    """Runs mSPRT for each variant against control. True multi-variant support."""
    results = []
    for v in variants:
        r = msprt_test(control["visitors"], control["conversions"], v["visitors"], v["conversions"], tau, alpha)
        r["label"] = v["label"]
        results.append(r)
    return {"control_label": control["label"], "comparisons": results}