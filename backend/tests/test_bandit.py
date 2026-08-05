"""
Run from backend/ with: pytest tests/test_bandit.py -v
"""
import pytest
from app.core.bandit import thompson_sample_allocation


def test_needs_at_least_two_variants():
    result = thompson_sample_allocation([{"label": "A", "visitors": 100, "conversions": 10}])
    assert "error" in result


def test_conversions_cannot_exceed_visitors():
    variants = [
        {"label": "A", "visitors": 100, "conversions": 200},
        {"label": "B", "visitors": 100, "conversions": 10},
    ]
    result = thompson_sample_allocation(variants)
    assert "error" in result


def test_allocations_sum_to_100():
    variants = [
        {"label": "A", "visitors": 1000, "conversions": 50},
        {"label": "B", "visitors": 1000, "conversions": 80},
        {"label": "C", "visitors": 1000, "conversions": 60},
    ]
    result = thompson_sample_allocation(variants, seed=1)
    total = sum(a["allocation_pct"] for a in result["allocations"])
    assert total == pytest.approx(100.0, abs=0.05)


def test_clear_winner_gets_majority_of_traffic():
    # B converts at 3x the rate of A on equal traffic -> B should dominate
    variants = [
        {"label": "A", "visitors": 2000, "conversions": 40},   # 2%
        {"label": "B", "visitors": 2000, "conversions": 120},  # 6%
    ]
    result = thompson_sample_allocation(variants, seed=1)
    alloc = {a["label"]: a["allocation_pct"] for a in result["allocations"]}
    assert alloc["B"] > alloc["A"]
    assert alloc["B"] > 60


def test_min_allocation_floor_is_respected():
    # even a clearly losing arm should never drop below the floor
    variants = [
        {"label": "A", "visitors": 5000, "conversions": 10},    # 0.2%
        {"label": "B", "visitors": 5000, "conversions": 500},   # 10%
    ]
    result = thompson_sample_allocation(variants, min_allocation_pct=5.0, seed=1)
    alloc = {a["label"]: a["allocation_pct"] for a in result["allocations"]}
    assert alloc["A"] >= 5.0 - 0.01  # tiny float slack


def test_floor_infeasible_falls_back_to_even_split():
    # 4 arms * 30% floor = 120% > 100% -> must fall back to even split
    variants = [
        {"label": l, "visitors": 100, "conversions": c}
        for l, c in zip(["A", "B", "C", "D"], [10, 20, 30, 40])
    ]
    result = thompson_sample_allocation(variants, min_allocation_pct=30.0, seed=1)
    for a in result["allocations"]:
        assert a["allocation_pct"] == pytest.approx(25.0, abs=0.01)


def test_identical_variants_get_roughly_equal_allocation():
    variants = [
        {"label": "A", "visitors": 1000, "conversions": 100},
        {"label": "B", "visitors": 1000, "conversions": 100},
    ]
    result = thompson_sample_allocation(variants, seed=1)
    alloc = {a["label"]: a["allocation_pct"] for a in result["allocations"]}
    assert abs(alloc["A"] - alloc["B"]) < 5  # roughly even, some sampling noise allowed


def test_same_seed_is_deterministic():
    variants = [
        {"label": "A", "visitors": 500, "conversions": 25},
        {"label": "B", "visitors": 500, "conversions": 40},
    ]
    result1 = thompson_sample_allocation(variants, seed=99)
    result2 = thompson_sample_allocation(variants, seed=99)
    assert result1["allocations"] == result2["allocations"]


def test_supports_more_than_two_arms():
    variants = [
        {"label": l, "visitors": 800, "conversions": c}
        for l, c in zip(["A", "B", "C", "D", "E"], [40, 55, 60, 30, 70])
    ]
    result = thompson_sample_allocation(variants, seed=3)
    assert len(result["allocations"]) == 5