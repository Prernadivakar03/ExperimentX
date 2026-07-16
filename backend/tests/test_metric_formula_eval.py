"""
Run from backend/ with: pytest tests/test_metric_formula_eval.py -v
"""
import pytest
from app.core.formula_eval import evaluate_formula, FormulaError


BASE = {"visitors": 1000, "conversions": 50, "event_count": 200, "event_sum": 4500.0}


def test_basic_division():
    assert evaluate_formula("conversions / visitors", BASE) == pytest.approx(0.05)


def test_basic_multiplication_and_precedence():
    assert evaluate_formula("conversions / visitors * 100", BASE) == pytest.approx(5.0)


def test_revenue_per_visitor():
    assert evaluate_formula("event_sum / visitors", BASE) == pytest.approx(4.5)


def test_parentheses_respected():
    result = evaluate_formula("(event_sum + 100) / visitors", BASE)
    assert result == pytest.approx(4.6)


def test_unknown_variable_rejected():
    with pytest.raises(FormulaError):
        evaluate_formula("revenue / visitors", BASE)  # "revenue" isn't a real variable


def test_division_by_zero_returns_zero_not_crash():
    result = evaluate_formula("conversions / visitors", {"visitors": 0, "conversions": 0,
                                                            "event_count": 0, "event_sum": 0})
    assert result == 0.0


# ── Security: reject anything that isn't pure arithmetic ───────────────────

def test_rejects_function_calls():
    with pytest.raises(FormulaError):
        evaluate_formula("__import__('os').system('echo hi')", BASE)


def test_rejects_attribute_access():
    with pytest.raises(FormulaError):
        evaluate_formula("visitors.__class__", BASE)


def test_rejects_string_literals():
    with pytest.raises(FormulaError):
        evaluate_formula("'a' + 'b'", BASE)


def test_rejects_list_or_comprehension():
    with pytest.raises(FormulaError):
        evaluate_formula("[x for x in range(10)]", BASE)


def test_rejects_lambda():
    with pytest.raises(FormulaError):
        evaluate_formula("(lambda: visitors)()", BASE)


def test_rejects_invalid_syntax():
    with pytest.raises(FormulaError):
        evaluate_formula("visitors / / conversions", BASE)


def test_rejects_comparison_operators():
    # comparisons aren't arithmetic — should be rejected, not silently return True/False
    with pytest.raises(FormulaError):
        evaluate_formula("visitors > conversions", BASE)


def test_negative_numbers_allowed():
    assert evaluate_formula("-conversions + visitors", BASE) == pytest.approx(950)
