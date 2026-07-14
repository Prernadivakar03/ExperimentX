# from fastapi import APIRouter, Depends, HTTPException
# from pydantic import BaseModel
# from typing import Optional, List
# import json

# from app.dependencies import get_current_user
# from app.models.user import User
# from app.core.ai import call_claude
# from app.routes.analytics import get_analytics

# router = APIRouter(prefix="/ai", tags=["ai"])


# # ── Schemas ───────────────────────────────────────────────────────────────────

# class PlanRequest(BaseModel):
#     goal: str

# class VariantRequest(BaseModel):
#     element: str
#     count: int = 5

# class ReviewRequest(BaseModel):
#     name: str
#     goal: str
#     duration_days: int
#     traffic_pct: float
#     variants: List[dict]
#     hypothesis: Optional[str] = None

# class InterpretRequest(BaseModel):
#     experiment_id: str

# class ChatMessage(BaseModel):
#     role: str
#     content: str

# class ChatRequest(BaseModel):
#     messages: List[ChatMessage]

# class ReportRequest(BaseModel):
#     experiment_id: str


# # ── Experiment Planner ────────────────────────────────────────────────────────

# @router.post("/plan-experiment")
# def plan_experiment(
#     payload: PlanRequest,
#     current_user: User = Depends(get_current_user),
# ):
#     system = """You are an expert experimentation strategist for ExperimentX.
# When given a business goal, respond ONLY with valid JSON matching this exact schema:
# {
#   "name": "string",
#   "hypothesis": "If we change X, then Y will improve because Z",
#   "primary_metric": "string",
#   "secondary_metrics": ["string"],
#   "guardrail_metrics": ["string"],
#   "variants": [
#     {"label": "A", "name": "string", "description": "string"},
#     {"label": "B", "name": "string", "description": "string"}
#   ],
#   "target_audience": "string",
#   "estimated_duration_days": 14,
#   "recommended_traffic_pct": 50,
#   "estimated_sample_size": 10000,
#   "risk_level": "Low",
#   "confidence_score": 85,
#   "reasoning": "string"
# }
# Return ONLY the JSON object. No markdown, no explanation, no backticks."""

#     try:
#         raw = call_claude(system, f"Business goal: {payload.goal}")
#         cleaned = raw.strip().lstrip("```json").lstrip("```").rstrip("```").strip()
#         return json.loads(cleaned)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"AI error: {str(e)}")


# # ── Variant Generator ─────────────────────────────────────────────────────────

# @router.post("/generate-variants")
# def generate_variants(
#     payload: VariantRequest,
#     current_user: User = Depends(get_current_user),
# ):
#     system = """You are a world-class conversion copywriter for ExperimentX.
# Respond ONLY with valid JSON matching this schema:
# {
#   "element": "string",
#   "variants": [
#     {
#       "label": "A",
#       "name": "Control",
#       "copy": "string",
#       "rationale": "string",
#       "predicted_lift": "+X%"
#     }
#   ],
#   "recommended": "B",
#   "reasoning": "string"
# }
# Return ONLY the JSON. No markdown, no backticks."""

#     try:
#         raw = call_claude(
#             system,
#             f"Generate {payload.count} variants for: {payload.element}",
#         )
#         cleaned = raw.strip().lstrip("```json").lstrip("```").rstrip("```").strip()
#         return json.loads(cleaned)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"AI error: {str(e)}")


# # ── Experiment Reviewer ───────────────────────────────────────────────────────

# @router.post("/review-experiment")
# def review_experiment(
#     payload: ReviewRequest,
#     current_user: User = Depends(get_current_user),
# ):
#     system = """You are a rigorous experimentation quality reviewer for ExperimentX.
# Respond ONLY with valid JSON matching this schema:
# {
#   "passed": ["string"],
#   "warnings": ["string"],
#   "errors": ["string"],
#   "confidence_score": 78,
#   "ready_to_launch": true,
#   "suggestions": ["string"],
#   "estimated_duration_fix": "string"
# }
# Flag: short durations (<7 days), low traffic (<10%), missing guardrail metrics, weak hypotheses, too few variants.
# Return ONLY the JSON. No markdown, no backticks."""

#     user_msg = f"""
# Experiment: {payload.name}
# Goal: {payload.goal}
# Duration: {payload.duration_days} days
# Traffic: {payload.traffic_pct}%
# Variants: {json.dumps(payload.variants)}
# Hypothesis: {payload.hypothesis or 'Not provided'}
# """

#     try:
#         raw = call_claude(system, user_msg)
#         cleaned = raw.strip().lstrip("```json").lstrip("```").rstrip("```").strip()
#         return json.loads(cleaned)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"AI error: {str(e)}")


# # ── Analytics Interpreter ─────────────────────────────────────────────────────

# @router.post("/interpret-results")
# async def interpret_results(
#     payload: InterpretRequest,
#     current_user: User = Depends(get_current_user),
# ):
#     from app.database import SessionLocal
#     from app.routes.analytics import get_analytics as fetch_analytics
#     from uuid import UUID

#     db = SessionLocal()
#     try:
#         stats = fetch_analytics(UUID(payload.experiment_id), db, current_user)
#     finally:
#         db.close()

#     system = """You are an expert statistician and data analyst for ExperimentX.
# Respond ONLY with valid JSON matching this schema:
# {
#   "summary": "string",
#   "winner": "A or B or None",
#   "lift": "+X.X%",
#   "confidence": "XX.X%",
#   "plain_english": "string (explain to a non-technical PM)",
#   "key_insights": ["string", "string", "string"],
#   "recommendation": "Deploy or Keep Running or Stop",
#   "recommendation_reason": "string",
#   "next_experiment": "string"
# }
# Return ONLY the JSON. No markdown, no backticks."""

#     user_msg = f"Experiment results: {json.dumps(stats)}"

#     try:
#         raw = call_claude(system, user_msg, max_tokens=1500)
#         cleaned = raw.strip().lstrip("```json").lstrip("```").rstrip("```").strip()
#         return json.loads(cleaned)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"AI error: {str(e)}")


# # ── General Chat ──────────────────────────────────────────────────────────────

# @router.post("/chat")
# def ai_chat(
#     payload: ChatRequest,
#     current_user: User = Depends(get_current_user),
# ):
#     from anthropic import Anthropic
#     import os

#     client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

#     system = """You are ExperimentX's AI Copilot — an expert in A/B testing, experimentation,
# conversion rate optimization, and product analytics.
# Be concise (under 120 words), practical, and actionable.
# Use bullet points when listing multiple things."""

#     messages = [{"role": m.role, "content": m.content} for m in payload.messages]

#     try:
#         response = client.messages.create(
#             model="claude-sonnet-4-6",
#             max_tokens=800,
#             system=system,
#             messages=messages,
#         )
#         return {"reply": response.content[0].text}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"AI error: {str(e)}")


# # ── Report Generator ──────────────────────────────────────────────────────────

# @router.post("/generate-report")
# async def generate_report(
#     payload: ReportRequest,
#     current_user: User = Depends(get_current_user),
# ):
#     from app.database import SessionLocal
#     from app.routes.analytics import get_analytics as fetch_analytics
#     from uuid import UUID

#     db = SessionLocal()
#     try:
#         stats = fetch_analytics(UUID(payload.experiment_id), db, current_user)
#     finally:
#         db.close()

#     system = """You are a senior data analyst writing an executive experiment report for ExperimentX.
# Write a professional, concise report in plain English. Structure it as:
# 1. Executive Summary (2-3 sentences)
# 2. What We Tested (1-2 sentences)
# 3. Key Results (bullet points with numbers)
# 4. Statistical Confidence (plain English explanation)
# 5. Recommendation (clear action: deploy/continue/stop)
# 6. Next Steps (2-3 bullet points)

# Be direct. Use actual numbers from the data. No fluff."""

#     user_msg = f"Generate a full experiment report for this data: {json.dumps(stats)}"

#     try:
#         report_text = call_claude(system, user_msg, max_tokens=1500)
#         return {"report": report_text}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"AI error: {str(e)}")












































from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
import json

from app.dependencies import get_current_user
from app.models.user import User
from app.core.ai import chat, chat_json
from app.database import get_db
from app.models.experiment import Experiment
from app.models.visitor import Visitor
from app.models.conversion import Conversion
from sqlalchemy.orm import Session
from uuid import UUID

router = APIRouter(prefix="/ai", tags=["ai"])


# ── Request schemas ───────────────────────────────────────────────────────────

class PlanRequest(BaseModel):
    goal: str

class VariantRequest(BaseModel):
    element: str
    count: int = 5

class ReviewRequest(BaseModel):
    name: str
    goal: str
    duration_days: int
    traffic_pct: int
    variants: list[dict]

class InterpretRequest(BaseModel):
    experiment_id: UUID

class ChatRequest(BaseModel):
    message: str
    history: Optional[list[dict]] = []

class ReportRequest(BaseModel):
    experiment_id: UUID


# ── 1. Experiment Planner ─────────────────────────────────────────────────────

@router.post("/plan-experiment")
def plan_experiment(
    payload: PlanRequest,
    current_user: User = Depends(get_current_user),
):
    system = """You are an expert A/B testing strategist. Given a business goal, create a complete experiment plan.
Return ONLY valid JSON in this exact structure:
{
  "name": "...",
  "hypothesis": "If we change X, then Y will improve because Z",
  "primary_metric": "...",
  "secondary_metrics": ["...", "..."],
  "guardrail_metrics": ["...", "..."],
  "variants": [
    {"label": "A", "name": "Control", "description": "..."},
    {"label": "B", "name": "Challenger", "description": "..."}
  ],
  "target_audience": "...",
  "estimated_duration_days": 14,
  "recommended_traffic_pct": 50,
  "estimated_sample_size": 10000,
  "risk_level": "Low",
  "confidence_score": 85,
  "reasoning": "..."
}"""

    try:
        raw = chat_json(system, f"Business goal: {payload.goal}")
        return json.loads(raw)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI error: {str(e)}")


# ── 2. Variant Generator ──────────────────────────────────────────────────────

@router.post("/generate-variants")
def generate_variants(
    payload: VariantRequest,
    current_user: User = Depends(get_current_user),
):
    system = """You are a world-class conversion copywriter. Generate multiple variant copies for A/B testing.
Return ONLY valid JSON:
{
  "element": "...",
  "variants": [
    {"label": "A", "name": "Control", "copy": "...", "rationale": "...", "predicted_lift": "+0%"},
    {"label": "B", "name": "...", "copy": "...", "rationale": "...", "predicted_lift": "+X%"}
  ],
  "recommended": "B",
  "reasoning": "..."
}"""

    try:
        raw = chat_json(system, f"Generate {payload.count} variants for: {payload.element}")
        return json.loads(raw)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI error: {str(e)}")


# ── 3. Experiment Reviewer ────────────────────────────────────────────────────

@router.post("/review-experiment")
def review_experiment(
    payload: ReviewRequest,
    current_user: User = Depends(get_current_user),
):
    system = """You are a rigorous experimentation quality reviewer. Check experiments for issues before launch.
Return ONLY valid JSON:
{
  "passed": ["..."],
  "warnings": ["..."],
  "errors": ["..."],
  "confidence_score": 78,
  "ready_to_launch": true,
  "suggestions": ["..."],
  "estimated_fix": "..."
}
Flag: short durations (<7 days), low traffic (<10%), missing guardrail metrics, vague hypotheses."""

    user_msg = f"""Experiment config:
Name: {payload.name}
Goal: {payload.goal}
Duration: {payload.duration_days} days
Traffic: {payload.traffic_pct}%
Variants: {json.dumps(payload.variants)}"""

    try:
        raw = chat_json(system, user_msg)
        return json.loads(raw)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI error: {str(e)}")


# ── 4. Analytics Interpreter — uses REAL DB data ──────────────────────────────

@router.post("/interpret-results")
def interpret_results(
    payload: InterpretRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Pull real data from database
    experiment = db.query(Experiment).filter(
        Experiment.id == payload.experiment_id,
        Experiment.owner_id == current_user.id,
    ).first()

    if not experiment:
        raise HTTPException(status_code=404, detail="Experiment not found")

    # Build stats summary for each variant
    variant_stats = []
    for variant in experiment.variants:
        visitors = db.query(Visitor).filter(
            Visitor.experiment_id == experiment.id,
            Visitor.variant_id == variant.id,
        ).count()

        conversions = db.query(Conversion).filter(
            Conversion.experiment_id == experiment.id,
            Conversion.variant_id == variant.id,
        ).count()

        rate = round((conversions / visitors * 100), 2) if visitors > 0 else 0

        variant_stats.append({
            "label": variant.label,
            "name": variant.name,
            "visitors": visitors,
            "conversions": conversions,
            "conversion_rate": rate,
        })

    system = """You are an expert data analyst specializing in A/B test interpretation.
Given real experiment results, provide clear analysis in plain English for non-statisticians.
Return ONLY valid JSON:
{
  "summary": "...",
  "winner": "A or B or None",
  "lift": "+X.X%",
  "confidence_note": "...",
  "plain_english": "...",
  "key_insights": ["...", "...", "..."],
  "recommendation": "Deploy or Keep Running or Stop",
  "recommendation_reason": "...",
  "next_experiment": "..."
}"""

    user_msg = f"""Experiment: {experiment.name}
Goal: {experiment.goal}
Status: {experiment.status}
Results: {json.dumps(variant_stats)}"""

    try:
        raw = chat_json(system, user_msg)
        return json.loads(raw)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI error: {str(e)}")


# ── 5. AI Chat ────────────────────────────────────────────────────────────────

@router.post("/chat")
def ai_chat(
    payload: ChatRequest,
    current_user: User = Depends(get_current_user),
):
    from groq import Groq
    import os

    client = Groq(api_key=os.getenv("GROQ_API_KEY"))

    system = """You are ExperimentX's AI Copilot — an expert in A/B testing, experimentation strategy, 
conversion optimization, and product analytics. Be concise (under 120 words), practical, and actionable. 
Use bullet points when listing things. You help product managers, developers, and growth teams run better experiments."""

    messages = [{"role": "system", "content": system}]

    # Include conversation history
    for msg in (payload.history or []):
        if msg.get("role") in ("user", "assistant") and msg.get("content"):
            messages.append({"role": msg["role"], "content": msg["content"]})

    messages.append({"role": "user", "content": payload.message})

    try:
        from app.core.ai import MODEL
        response = client.chat.completions.create(
            model=MODEL,
            messages=messages,
            max_tokens=400,
            temperature=0.7,
        )
        return {"reply": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI error: {str(e)}")


# ── 6. Report Generator — uses REAL DB data ───────────────────────────────────

@router.post("/generate-report")
def generate_report(
    payload: ReportRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    experiment = db.query(Experiment).filter(
        Experiment.id == payload.experiment_id,
        Experiment.owner_id == current_user.id,
    ).first()

    if not experiment:
        raise HTTPException(status_code=404, detail="Experiment not found")

    variant_stats = []
    for variant in experiment.variants:
        visitors = db.query(Visitor).filter(
            Visitor.experiment_id == experiment.id,
            Visitor.variant_id == variant.id,
        ).count()
        conversions = db.query(Conversion).filter(
            Conversion.experiment_id == experiment.id,
            Conversion.variant_id == variant.id,
        ).count()
        rate = round((conversions / visitors * 100), 2) if visitors > 0 else 0
        variant_stats.append({
            "label": variant.label,
            "name": variant.name,
            "visitors": visitors,
            "conversions": conversions,
            "conversion_rate": rate,
        })

    system = """You are an expert experimentation analyst writing a formal experiment report.
Write a clear, professional report in plain English. Include: executive summary, methodology, 
results, statistical analysis, business impact, and clear recommendation.
Keep it under 400 words. Be specific about numbers. Use the actual data provided."""

    user_msg = f"""Write a full experiment report for:
Experiment: {experiment.name}
Goal: {experiment.goal}
Status: {experiment.status}
Started: {experiment.created_at.strftime('%B %d, %Y')}
Results by variant: {json.dumps(variant_stats)}"""

    try:
        report_text = chat(system, user_msg, max_tokens=600)
        return {"report": report_text, "experiment_name": experiment.name}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI error: {str(e)}")