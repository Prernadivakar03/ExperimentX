"""
Bayesian multi-variant testing using a Beta-Binomial conjugate model.
Alternative to the frequentist engine in stats.py — same inputs, different
interpretation: instead of p-values, this gives P(variant is best) and
expected loss, which is what most people actually want to know.
"""
import numpy as np


def bayesian_test(
    variants: list[dict],
    prior_alpha: float = 1.0,
    prior_beta: float = 1.0,
    n_samples: int = 100_000,
    seed: int | None = None,
) -> dict:
    """
    variants: [{"label": "A", "visitors": 5000, "conversions": 250}, ...]
    prior_alpha/prior_beta: Beta(1,1) = uniform/uninformative prior by default.
    Returns per-variant posterior stats, P(best), and expected loss vs best.
    Scales to any number of variants (true multi-variant, not pairwise).
    """
    if len(variants) < 2:
        return {"error": "Need at least 2 variants"}

    rng = np.random.default_rng(seed)

    posteriors = []
    samples = np.zeros((n_samples, len(variants)))

    for i, v in enumerate(variants):
        conv = v["conversions"]
        n = v["visitors"]
        alpha = prior_alpha + conv
        beta = prior_beta + (n - conv)
        draws = rng.beta(alpha, beta, size=n_samples)
        samples[:, i] = draws
        posteriors.append({
            "label": v["label"],
            "alpha": alpha,
            "beta": beta,
            "posterior_mean": round(float(alpha / (alpha + beta)), 4),
            "credible_interval_95": [
                round(float(np.percentile(draws, 2.5)), 4),
                round(float(np.percentile(draws, 97.5)), 4),
            ],
        })

    # P(variant i is best) = fraction of MC draws where it has the max rate
    best_idx = np.argmax(samples, axis=1)
    for i, p in enumerate(posteriors):
        p["prob_best"] = round(float(np.mean(best_idx == i)), 4)

    # Expected loss: how much you'd regret picking this variant, in expectation,
    # if it turns out NOT to be the true best. Standard Bayesian decision rule —
    # pick the variant with the lowest expected loss, not just highest prob_best.
    max_per_draw = samples.max(axis=1)
    for i, p in enumerate(posteriors):
        loss = np.mean(max_per_draw - samples[:, i])
        p["expected_loss"] = round(float(loss), 5)

    winner = max(posteriors, key=lambda p: p["prob_best"])
    # Common stopping rule: expected loss below 0.1% of baseline is "safe to call"
    baseline_rate = posteriors[0]["posterior_mean"] or 0.001
    threshold = 0.001 * baseline_rate
    ready_to_call = winner["expected_loss"] < threshold

    return {
        "variants": posteriors,
        "leading_variant": winner["label"],
        "leading_prob_best": winner["prob_best"],
        "ready_to_call": ready_to_call,
        "loss_threshold": round(threshold, 6),
        "method": "beta_binomial_monte_carlo",
        "n_samples": n_samples,
    }