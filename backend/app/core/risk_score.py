"""
Deterministic pre-launch risk scoring. The SCORE is pure math — never AI.
AI is only used afterward to phrase the reasoning in plain English,
strictly from these computed signals (see routes/ai.py).
"""

def compute_risk_signals(
    num_variants: int,
    traffic_pct: int,
    duration_days: int,
    current_sample_size: int,
    target_sample_size: int | None,
    is_in_mutual_exclusion_group: bool,
    srm_flagged: bool,
    has_guardrail_metric: bool,
) -> dict:
    score = 0  # 0 = no risk, 100 = max risk
    reasons = []

    if duration_days < 7:
        score += 25
        reasons.append(f"Duration is only {duration_days} days — under a week risks missing weekly traffic cycles (weekday vs weekend behavior).")

    if traffic_pct < 10:
        score += 15
        reasons.append(f"Only {traffic_pct}% of traffic is allocated — this will slow down reaching a conclusive sample size.")

    if target_sample_size:
        progress = current_sample_size / target_sample_size * 100
        if progress < 20:
            score += 10
            reasons.append(f"Only {progress:.0f}% of the target sample size collected so far.")
    else:
        score += 15
        reasons.append("No target sample size configured — you have no way to know when you have enough data.")

    if not has_guardrail_metric:
        score += 15
        reasons.append("No guardrail metric defined — a 'winning' variant could be silently hurting revenue or another key metric.")

    if srm_flagged:
        score += 30
        reasons.append("Sample Ratio Mismatch detected — traffic split doesn't match configuration, results may not be trustworthy.")

    if num_variants > 4 and not is_in_mutual_exclusion_group:
        score += 10
        reasons.append(f"{num_variants} variants running without a mutual exclusion group — check for unintended overlap with other tests.")

    score = min(score, 100)
    level = "low" if score < 25 else ("medium" if score < 55 else "high")

    return {
        "risk_score": score,
        "risk_level": level,
        "signals": reasons,
    }