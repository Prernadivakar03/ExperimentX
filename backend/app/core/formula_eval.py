"""
Restricted arithmetic evaluator for custom metric formulas.
Only allows: + - * / ( ) and named variables from a fixed dict.
Never uses eval()/exec() — walks a whitelisted AST instead.
"""
import ast
import operator

_ALLOWED_OPS = {
    ast.Add: operator.add,
    ast.Sub: operator.sub,
    ast.Mult: operator.mul,
    ast.Div: operator.truediv,
    ast.USub: operator.neg,
    ast.UAdd: operator.pos,
}


class FormulaError(Exception):
    pass


def evaluate_formula(formula: str, variables: dict) -> float:
    try:
        tree = ast.parse(formula, mode="eval")
    except SyntaxError as e:
        raise FormulaError(f"Invalid formula syntax: {e}")

    def _eval(node):
        if isinstance(node, ast.Expression):
            return _eval(node.body)
        if isinstance(node, ast.Constant):
            if not isinstance(node.value, (int, float)):
                raise FormulaError("Only numeric constants are allowed")
            return node.value
        if isinstance(node, ast.Name):
            if node.id not in variables:
                raise FormulaError(f"Unknown variable '{node.id}'. Available: {list(variables.keys())}")
            return variables[node.id]
        if isinstance(node, ast.BinOp):
            op_type = type(node.op)
            if op_type not in _ALLOWED_OPS:
                raise FormulaError("Only + - * / are allowed")
            left = _eval(node.left)
            right = _eval(node.right)
            if op_type is ast.Div and right == 0:
                return 0.0  # avoid ZeroDivisionError — 0 visitors/events means metric is 0, not an error
            return _ALLOWED_OPS[op_type](left, right)
        if isinstance(node, ast.UnaryOp):
            op_type = type(node.op)
            if op_type not in _ALLOWED_OPS:
                raise FormulaError("Unsupported unary operator")
            return _ALLOWED_OPS[op_type](_eval(node.operand))
        raise FormulaError(f"Unsupported expression: {type(node).__name__}")

    return float(_eval(tree))