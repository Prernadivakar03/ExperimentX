"""
Deterministic anomaly detection on daily visitor/conversion counts.
Uses a simple z-score against a trailing baseline — no ML model needed
for this to be useful; a sudden multi-sigma drop/spike is the actual signal.
"""
import statistics


def detect_traffic_anomaly(daily_counts: list[int], min_baseline_days: int = 4) -> dict:
    """
    daily_counts: chronological list of visitor (or conversion) counts, e.g. last 14 days.
    Flags the LAST day in the list if it's a statistical outlier vs. the days before it.
    """
    if len(daily_counts) < min_baseline_days + 1:
        return {"checked": False, "reason": f"Need at least {min_baseline_days + 1} days of data"}

    *baseline, latest = daily_counts
    mean = statistics.mean(baseline)
    stdev = statistics.pstdev(baseline)

    if stdev == 0:
        # perfectly flat baseline — any deviation at all is notable
        anomalous = latest != mean
        z = float("inf") if anomalous else 0.0
    else:
        z = (latest - mean) / stdev
        anomalous = abs(z) > 2.5  # ~2.5 sigma, conservative threshold to avoid noisy false positives

    direction = "drop" if latest < mean else "spike"

    return {
        "checked": True,
        "anomalous": anomalous,
        "z_score": round(z, 2) if z != float("inf") else None,
        "latest_value": latest,
        "baseline_mean": round(mean, 1),
        "direction": direction if anomalous else "none",
        "message": (
            f"Today's count ({latest}) is a {direction} of {abs(z):.1f} standard deviations "
            f"from the {len(baseline)}-day baseline ({mean:.1f}) — possible tracking break, "
            f"bot traffic, or a real external event."
            if anomalous else "Traffic pattern looks normal."
        ),
    }