"""
Thompson Sampling multi-armed bandit — dynamic traffic allocation instead
of a fixed split. Each arm (variant) is a Beta(alpha, beta) posterior;
allocation probability = P(this arm is best), recomputed as data comes in.
True N-arm support.
"""
import numpy as np


def thompson_sample_allocation(
    variants: list[dict],
    n_samples: int = 20_000,
    min_allocation_pct: float = 5.0,
    seed: int | None = None,
) -> dict:
    """
    variants: [{"label": "A", "visitors": 1000, "conversions": 50}, ...]
    Returns the traffic % each variant SHOULD get right now.
    """
    if len(variants) < 2:
        return {"error": "Need at least 2 variants"}
    if any(v["conversions"] > v["visitors"] for v in variants):
        return {"error": "Conversions cannot exceed visitors"}

    rng = np.random.default_rng(seed)
    samples = np.zeros((n_samples, len(variants)))

    for i, v in enumerate(variants):
        alpha = 1 + v["conversions"]
        beta = 1 + (v["visitors"] - v["conversions"])
        samples[:, i] = rng.beta(alpha, beta, size=n_samples)

    win_counts = np.zeros(len(variants))
    best_idx = np.argmax(samples, axis=1)
    for i in range(len(variants)):
        win_counts[i] = np.sum(best_idx == i)

    raw_alloc = win_counts / n_samples * 100  # prob_best per arm, sums to 100

    n_arms = len(variants)
    total_floor = min_allocation_pct * n_arms

    if total_floor >= 100:
        # Floor infeasible for this many arms — only sane fallback is even split
        final = np.full(n_arms, 100 / n_arms)
    else:
        # Guarantee the floor first, then distribute ONLY the remaining pool
        # proportionally by prob_best. Applying max() before normalizing dilutes
        # the floor back below its target once you rescale to sum to 100.
        remaining_pool = 100 - total_floor
        raw_sum = raw_alloc.sum()
        proportional = raw_alloc / raw_sum if raw_sum > 0 else np.full(n_arms, 1 / n_arms)
        final = min_allocation_pct + proportional * remaining_pool

    allocations = [
        {"label": v["label"], "allocation_pct": round(float(pct), 2)}
        for v, pct in zip(variants, final)
    ]

    return {
        "allocations": allocations,
        "method": "thompson_sampling",
        "min_allocation_floor_pct": min_allocation_pct,
    }