
# from fastapi import APIRouter, Depends, HTTPException
# from pydantic import BaseModel
# from typing import Optional
# import json

# from app.dependencies import get_current_user
# from app.models.user import User
# from app.core.ai import chat, chat_json
# from app.database import get_db
# from app.models.experiment import Experiment
# from app.models.visitor import Visitor
# from app.models.conversion import Conversion
# from sqlalchemy.orm import Session
# from uuid import UUID

# router = APIRouter(prefix="/ai", tags=["ai"])


# # ── Request schemas ───────────────────────────────────────────────────────────

# class PlanRequest(BaseModel):
#     goal: str

# class VariantRequest(BaseModel):
#     element: str
#     count: int = 5

# class ReviewRequest(BaseModel):
#     name: str
#     goal: str
#     duration_days: int
#     traffic_pct: int
#     variants: list[dict]

# class InterpretRequest(BaseModel):
#     experiment_id: UUID

# class ChatRequest(BaseModel):
#     message: str
#     history: Optional[list[dict]] = []

# class ReportRequest(BaseModel):
#     experiment_id: UUID


# # ── 1. Experiment Planner ─────────────────────────────────────────────────────

# @router.post("/plan-experiment")
# def plan_experiment(
#     payload: PlanRequest,
#     current_user: User = Depends(get_current_user),
# ):
#     system = """You are an expert A/B testing strategist. Given a business goal, create a complete experiment plan.
# Return ONLY valid JSON in this exact structure:
# {
#   "name": "...",
#   "hypothesis": "If we change X, then Y will improve because Z",
#   "primary_metric": "...",
#   "secondary_metrics": ["...", "..."],
#   "guardrail_metrics": ["...", "..."],
#   "variants": [
#     {"label": "A", "name": "Control", "description": "..."},
#     {"label": "B", "name": "Challenger", "description": "..."}
#   ],
#   "target_audience": "...",
#   "estimated_duration_days": 14,
#   "recommended_traffic_pct": 50,
#   "estimated_sample_size": 10000,
#   "risk_level": "Low",
#   "confidence_score": 85,
#   "reasoning": "..."
# }"""

#     try:
#         raw = chat_json(system, f"Business goal: {payload.goal}")
#         return json.loads(raw)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"AI error: {str(e)}")


# # ── 2. Variant Generator ──────────────────────────────────────────────────────

# @router.post("/generate-variants")
# def generate_variants(
#     payload: VariantRequest,
#     current_user: User = Depends(get_current_user),
# ):
#     system = """You are a world-class conversion copywriter. Generate multiple variant copies for A/B testing.
# Return ONLY valid JSON:
# {
#   "element": "...",
#   "variants": [
#     {"label": "A", "name": "Control", "copy": "...", "rationale": "...", "predicted_lift": "+0%"},
#     {"label": "B", "name": "...", "copy": "...", "rationale": "...", "predicted_lift": "+X%"}
#   ],
#   "recommended": "B",
#   "reasoning": "..."
# }"""

#     try:
#         raw = chat_json(system, f"Generate {payload.count} variants for: {payload.element}")
#         return json.loads(raw)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"AI error: {str(e)}")


# # ── 3. Experiment Reviewer ────────────────────────────────────────────────────

# @router.post("/review-experiment")
# def review_experiment(
#     payload: ReviewRequest,
#     current_user: User = Depends(get_current_user),
# ):
#     system = """You are a rigorous experimentation quality reviewer. Check experiments for issues before launch.
# Return ONLY valid JSON:
# {
#   "passed": ["..."],
#   "warnings": ["..."],
#   "errors": ["..."],
#   "confidence_score": 78,
#   "ready_to_launch": true,
#   "suggestions": ["..."],
#   "estimated_fix": "..."
# }
# Flag: short durations (<7 days), low traffic (<10%), missing guardrail metrics, vague hypotheses."""

#     user_msg = f"""Experiment config:
# Name: {payload.name}
# Goal: {payload.goal}
# Duration: {payload.duration_days} days
# Traffic: {payload.traffic_pct}%
# Variants: {json.dumps(payload.variants)}"""

#     try:
#         raw = chat_json(system, user_msg)
#         return json.loads(raw)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"AI error: {str(e)}")


# # ── 4. Analytics Interpreter — uses REAL DB data ──────────────────────────────

# @router.post("/interpret-results")
# def interpret_results(
#     payload: InterpretRequest,
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user),
# ):
#     # Pull real data from database
#     experiment = db.query(Experiment).filter(
#         Experiment.id == payload.experiment_id,
#         Experiment.owner_id == current_user.id,
#     ).first()

#     if not experiment:
#         raise HTTPException(status_code=404, detail="Experiment not found")

#     # Build stats summary for each variant
#     variant_stats = []
#     for variant in experiment.variants:
#         visitors = db.query(Visitor).filter(
#             Visitor.experiment_id == experiment.id,
#             Visitor.variant_id == variant.id,
#         ).count()

#         conversions = db.query(Conversion).filter(
#             Conversion.experiment_id == experiment.id,
#             Conversion.variant_id == variant.id,
#         ).count()

#         rate = round((conversions / visitors * 100), 2) if visitors > 0 else 0

#         variant_stats.append({
#             "label": variant.label,
#             "name": variant.name,
#             "visitors": visitors,
#             "conversions": conversions,
#             "conversion_rate": rate,
#         })

#     system = """You are an expert data analyst specializing in A/B test interpretation.
# Given real experiment results, provide clear analysis in plain English for non-statisticians.
# Return ONLY valid JSON:
# {
#   "summary": "...",
#   "winner": "A or B or None",
#   "lift": "+X.X%",
#   "confidence_note": "...",
#   "plain_english": "...",
#   "key_insights": ["...", "...", "..."],
#   "recommendation": "Deploy or Keep Running or Stop",
#   "recommendation_reason": "...",
#   "next_experiment": "..."
# }"""

#     user_msg = f"""Experiment: {experiment.name}
# Goal: {experiment.goal}
# Status: {experiment.status}
# Results: {json.dumps(variant_stats)}"""

#     try:
#         raw = chat_json(system, user_msg)
#         return json.loads(raw)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"AI error: {str(e)}")


# # ── 5. AI Chat ────────────────────────────────────────────────────────────────

# @router.post("/chat")
# def ai_chat(
#     payload: ChatRequest,
#     current_user: User = Depends(get_current_user),
# ):
#     from groq import Groq
#     import os

#     client = Groq(api_key=os.getenv("GROQ_API_KEY"))

#     system = """You are ExperimentX's AI Copilot — an expert in A/B testing, experimentation strategy, 
# conversion optimization, and product analytics. Be concise (under 120 words), practical, and actionable. 
# Use bullet points when listing things. You help product managers, developers, and growth teams run better experiments."""

#     messages = [{"role": "system", "content": system}]

#     # Include conversation history
#     for msg in (payload.history or []):
#         if msg.get("role") in ("user", "assistant") and msg.get("content"):
#             messages.append({"role": msg["role"], "content": msg["content"]})

#     messages.append({"role": "user", "content": payload.message})

#     try:
#         from app.core.ai import MODEL
#         response = client.chat.completions.create(
#             model=MODEL,
#             messages=messages,
#             max_tokens=400,
#             temperature=0.7,
#         )
#         return {"reply": response.choices[0].message.content}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"AI error: {str(e)}")


# # ── 6. Report Generator — uses REAL DB data ───────────────────────────────────

# @router.post("/generate-report")
# def generate_report(
#     payload: ReportRequest,
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user),
# ):
#     experiment = db.query(Experiment).filter(
#         Experiment.id == payload.experiment_id,
#         Experiment.owner_id == current_user.id,
#     ).first()

#     if not experiment:
#         raise HTTPException(status_code=404, detail="Experiment not found")

#     variant_stats = []
#     for variant in experiment.variants:
#         visitors = db.query(Visitor).filter(
#             Visitor.experiment_id == experiment.id,
#             Visitor.variant_id == variant.id,
#         ).count()
#         conversions = db.query(Conversion).filter(
#             Conversion.experiment_id == experiment.id,
#             Conversion.variant_id == variant.id,
#         ).count()
#         rate = round((conversions / visitors * 100), 2) if visitors > 0 else 0
#         variant_stats.append({
#             "label": variant.label,
#             "name": variant.name,
#             "visitors": visitors,
#             "conversions": conversions,
#             "conversion_rate": rate,
#         })

#     system = """You are an expert experimentation analyst writing a formal experiment report.
# Write a clear, professional report in plain English. Include: executive summary, methodology, 
# results, statistical analysis, business impact, and clear recommendation.
# Keep it under 400 words. Be specific about numbers. Use the actual data provided."""

#     user_msg = f"""Write a full experiment report for:
# Experiment: {experiment.name}
# Goal: {experiment.goal}
# Status: {experiment.status}
# Started: {experiment.created_at.strftime('%B %d, %Y')}
# Results by variant: {json.dumps(variant_stats)}"""

#     try:
#         report_text = chat(system, user_msg, max_tokens=600)
#         return {"report": report_text, "experiment_name": experiment.name}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"AI error: {str(e)}")
    


















# from fastapi import APIRouter, Depends, HTTPException
# from pydantic import BaseModel
# from typing import Optional, List
# import json

# from app.dependencies import get_current_user
# from app.models.user import User
# from app.core.ai import chat, chat_json
# from app.database import get_db
# from app.models.experiment import Experiment
# from app.models.visitor import Visitor
# from app.models.conversion import Conversion
# from sqlalchemy.orm import Session
# from uuid import UUID

# # ── New imports for risk & anomaly ──────────────────────────────────────────
# from app.core.risk_score import compute_risk_signals
# from app.core.anomaly import detect_traffic_anomaly
# from app.core.stats import srm_check
# from app.models.mutual_exclusion import MutualExclusionMembership

# router = APIRouter(prefix="/ai", tags=["ai"])


# # ── Request schemas ───────────────────────────────────────────────────────────

# class PlanRequest(BaseModel):
#     goal: str

# class VariantRequest(BaseModel):
#     element: str
#     count: int = 5

# class ReviewRequest(BaseModel):
#     name: str
#     goal: str
#     duration_days: int
#     traffic_pct: int
#     variants: list[dict]

# class InterpretRequest(BaseModel):
#     experiment_id: UUID

# class ChatRequest(BaseModel):
#     message: str
#     history: Optional[list[dict]] = []

# class ReportRequest(BaseModel):
#     experiment_id: UUID

# # ── New schemas for risk & anomaly ──────────────────────────────────────────

# class RiskScoreRequest(BaseModel):
#     experiment_id: UUID

# class AnomalyRequest(BaseModel):
#     experiment_id: UUID
#     daily_visitor_counts: list[int]   # chronological, most recent last


# # ── 1. Experiment Planner ─────────────────────────────────────────────────────

# @router.post("/plan-experiment")
# def plan_experiment(
#     payload: PlanRequest,
#     current_user: User = Depends(get_current_user),
# ):
#     system = """You are an expert A/B testing strategist. Given a business goal, create a complete experiment plan.
# Return ONLY valid JSON in this exact structure:
# {
#   "name": "...",
#   "hypothesis": "If we change X, then Y will improve because Z",
#   "primary_metric": "...",
#   "secondary_metrics": ["...", "..."],
#   "guardrail_metrics": ["...", "..."],
#   "variants": [
#     {"label": "A", "name": "Control", "description": "..."},
#     {"label": "B", "name": "Challenger", "description": "..."}
#   ],
#   "target_audience": "...",
#   "estimated_duration_days": 14,
#   "recommended_traffic_pct": 50,
#   "estimated_sample_size": 10000,
#   "risk_level": "Low",
#   "confidence_score": 85,
#   "reasoning": "..."
# }"""

#     try:
#         raw = chat_json(system, f"Business goal: {payload.goal}")
#         return json.loads(raw)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"AI error: {str(e)}")


# # ── 2. Variant Generator ──────────────────────────────────────────────────────

# @router.post("/generate-variants")
# def generate_variants(
#     payload: VariantRequest,
#     current_user: User = Depends(get_current_user),
# ):
#     system = """You are a world-class conversion copywriter. Generate multiple variant copies for A/B testing.
# Return ONLY valid JSON:
# {
#   "element": "...",
#   "variants": [
#     {"label": "A", "name": "Control", "copy": "...", "rationale": "...", "predicted_lift": "+0%"},
#     {"label": "B", "name": "...", "copy": "...", "rationale": "...", "predicted_lift": "+X%"}
#   ],
#   "recommended": "B",
#   "reasoning": "..."
# }"""

#     try:
#         raw = chat_json(system, f"Generate {payload.count} variants for: {payload.element}")
#         return json.loads(raw)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"AI error: {str(e)}")


# # ── 3. Experiment Reviewer ────────────────────────────────────────────────────

# @router.post("/review-experiment")
# def review_experiment(
#     payload: ReviewRequest,
#     current_user: User = Depends(get_current_user),
# ):
#     system = """You are a rigorous experimentation quality reviewer. Check experiments for issues before launch.
# Return ONLY valid JSON:
# {
#   "passed": ["..."],
#   "warnings": ["..."],
#   "errors": ["..."],
#   "confidence_score": 78,
#   "ready_to_launch": true,
#   "suggestions": ["..."],
#   "estimated_fix": "..."
# }
# Flag: short durations (<7 days), low traffic (<10%), missing guardrail metrics, vague hypotheses."""

#     user_msg = f"""Experiment config:
# Name: {payload.name}
# Goal: {payload.goal}
# Duration: {payload.duration_days} days
# Traffic: {payload.traffic_pct}%
# Variants: {json.dumps(payload.variants)}"""

#     try:
#         raw = chat_json(system, user_msg)
#         return json.loads(raw)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"AI error: {str(e)}")


# # ── 4. Analytics Interpreter — uses REAL DB data ──────────────────────────────

# @router.post("/interpret-results")
# def interpret_results(
#     payload: InterpretRequest,
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user),
# ):
#     # Pull real data from database
#     experiment = db.query(Experiment).filter(
#         Experiment.id == payload.experiment_id,
#         Experiment.owner_id == current_user.id,
#     ).first()

#     if not experiment:
#         raise HTTPException(status_code=404, detail="Experiment not found")

#     # Build stats summary for each variant
#     variant_stats = []
#     for variant in experiment.variants:
#         visitors = db.query(Visitor).filter(
#             Visitor.experiment_id == experiment.id,
#             Visitor.variant_id == variant.id,
#         ).count()

#         conversions = db.query(Conversion).filter(
#             Conversion.experiment_id == experiment.id,
#             Conversion.variant_id == variant.id,
#         ).count()

#         rate = round((conversions / visitors * 100), 2) if visitors > 0 else 0

#         variant_stats.append({
#             "label": variant.label,
#             "name": variant.name,
#             "visitors": visitors,
#             "conversions": conversions,
#             "conversion_rate": rate,
#         })

#     system = """You are an expert data analyst specializing in A/B test interpretation.
# Given real experiment results, provide clear analysis in plain English for non-statisticians.
# Return ONLY valid JSON:
# {
#   "summary": "...",
#   "winner": "A or B or None",
#   "lift": "+X.X%",
#   "confidence_note": "...",
#   "plain_english": "...",
#   "key_insights": ["...", "...", "..."],
#   "recommendation": "Deploy or Keep Running or Stop",
#   "recommendation_reason": "...",
#   "next_experiment": "..."
# }"""

#     user_msg = f"""Experiment: {experiment.name}
# Goal: {experiment.goal}
# Status: {experiment.status}
# Results: {json.dumps(variant_stats)}"""

#     try:
#         raw = chat_json(system, user_msg)
#         return json.loads(raw)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"AI error: {str(e)}")


# # ── 5. AI Chat ────────────────────────────────────────────────────────────────

# @router.post("/chat")
# def ai_chat(
#     payload: ChatRequest,
#     current_user: User = Depends(get_current_user),
# ):
#     from groq import Groq
#     import os

#     client = Groq(api_key=os.getenv("GROQ_API_KEY"))

#     system = """You are ExperimentX's AI Copilot — an expert in A/B testing, experimentation strategy, 
# conversion optimization, and product analytics. Be concise (under 120 words), practical, and actionable. 
# Use bullet points when listing things. You help product managers, developers, and growth teams run better experiments."""

#     messages = [{"role": "system", "content": system}]

#     # Include conversation history
#     for msg in (payload.history or []):
#         if msg.get("role") in ("user", "assistant") and msg.get("content"):
#             messages.append({"role": msg["role"], "content": msg["content"]})

#     messages.append({"role": "user", "content": payload.message})

#     try:
#         from app.core.ai import MODEL
#         response = client.chat.completions.create(
#             model=MODEL,
#             messages=messages,
#             max_tokens=400,
#             temperature=0.7,
#         )
#         return {"reply": response.choices[0].message.content}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"AI error: {str(e)}")


# # ── 6. Report Generator — uses REAL DB data ───────────────────────────────────

# @router.post("/generate-report")
# def generate_report(
#     payload: ReportRequest,
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user),
# ):
#     experiment = db.query(Experiment).filter(
#         Experiment.id == payload.experiment_id,
#         Experiment.owner_id == current_user.id,
#     ).first()

#     if not experiment:
#         raise HTTPException(status_code=404, detail="Experiment not found")

#     variant_stats = []
#     for variant in experiment.variants:
#         visitors = db.query(Visitor).filter(
#             Visitor.experiment_id == experiment.id,
#             Visitor.variant_id == variant.id,
#         ).count()
#         conversions = db.query(Conversion).filter(
#             Conversion.experiment_id == experiment.id,
#             Conversion.variant_id == variant.id,
#         ).count()
#         rate = round((conversions / visitors * 100), 2) if visitors > 0 else 0
#         variant_stats.append({
#             "label": variant.label,
#             "name": variant.name,
#             "visitors": visitors,
#             "conversions": conversions,
#             "conversion_rate": rate,
#         })

#     system = """You are an expert experimentation analyst writing a formal experiment report.
# Write a clear, professional report in plain English. Include: executive summary, methodology, 
# results, statistical analysis, business impact, and clear recommendation.
# Keep it under 400 words. Be specific about numbers. Use the actual data provided."""

#     user_msg = f"""Write a full experiment report for:
# Experiment: {experiment.name}
# Goal: {experiment.goal}
# Status: {experiment.status}
# Started: {experiment.created_at.strftime('%B %d, %Y')}
# Results by variant: {json.dumps(variant_stats)}"""

#     try:
#         report_text = chat(system, user_msg, max_tokens=600)
#         return {"report": report_text, "experiment_name": experiment.name}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"AI error: {str(e)}")


# # ── 7. Risk Score ─────────────────────────────────────────────────────────────

# @router.post("/risk-score")
# def risk_score(
#     payload: RiskScoreRequest,
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user),
# ):
#     experiment = db.query(Experiment).filter(
#         Experiment.id == payload.experiment_id,
#         Experiment.owner_id == current_user.id,
#     ).first()
#     if not experiment:
#         raise HTTPException(status_code=404, detail="Experiment not found")

#     variant_stats = []
#     for variant in experiment.variants:
#         visitors = db.query(Visitor).filter(
#             Visitor.experiment_id == experiment.id,
#             Visitor.variant_id == variant.id,
#         ).count()
#         variant_stats.append({
#             "label": variant.label,
#             "visitors": visitors,
#             "traffic_split": 1 / len(experiment.variants)
#         })

#     total_visitors = sum(v["visitors"] for v in variant_stats)
#     srm_result = srm_check(variant_stats) if variant_stats else {"mismatched": False}
#     in_group = db.query(MutualExclusionMembership).filter(
#         MutualExclusionMembership.experiment_id == experiment.id,
#     ).first() is not None

#     signals = compute_risk_signals(
#         num_variants=len(experiment.variants),
#         traffic_pct=100,  # wire to a real traffic_pct field if/when you add one to Experiment
#         duration_days=experiment.planned_duration_days or 0,
#         current_sample_size=total_visitors,
#         target_sample_size=experiment.target_sample_size,
#         is_in_mutual_exclusion_group=in_group,
#         srm_flagged=srm_result.get("mismatched", False),
#         has_guardrail_metric=False,  # wire to real per-experiment guardrail linkage once that exists
#     )

#     system = """You are summarizing pre-launch risk signals for an A/B test.
# You are given a computed risk score and a list of specific reasons — DO NOT invent
# any additional reasons, causes, or details not in the provided list. Only rephrase
# and prioritize what's given, in plain English, in 2-3 sentences."""

#     user_msg = f"Experiment: {experiment.name}\nRisk score: {signals['risk_score']}/100 ({signals['risk_level']})\nSignals: {json.dumps(signals['signals'])}"

#     try:
#         summary = chat(system, user_msg, max_tokens=200)
#     except Exception:
#         summary = None  # deterministic signals still returned even if AI phrasing fails

#     return {**signals, "ai_summary": summary}


# # ── 8. Anomaly Detection ──────────────────────────────────────────────────────

# @router.post("/detect-anomaly")
# def detect_anomaly(
#     payload: AnomalyRequest,
#     current_user: User = Depends(get_current_user),
# ):
#     result = detect_traffic_anomaly(payload.daily_visitor_counts)

#     if not result.get("anomalous"):
#         return result

#     system = """You are flagging a traffic anomaly in an A/B test to a product manager.
# You are given a computed anomaly (z-score, direction, values) — DO NOT invent a cause.
# List 2-3 PLAUSIBLE causes a human should check (e.g. tracking bug, bot traffic, deploy,
# marketing campaign, external event) as things to investigate, not confirmed facts."""

#     user_msg = json.dumps(result)

#     try:
#         raw = chat_json(system, user_msg)
#         result["ai_investigation_suggestions"] = json.loads(raw)
#     except Exception:
#         pass

#     return result







































































from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List
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

# ── Imports for risk & anomaly ──────────────────────────────────────────────
from app.core.risk_score import compute_risk_signals
from app.core.anomaly import detect_traffic_anomaly
from app.core.stats import srm_check
from app.models.mutual_exclusion import MutualExclusionMembership

# ── Imports for explainability ──────────────────────────────────────────────
from app.core.explainability import build_funnel_breakdown, find_largest_divergence

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

# ── Schemas for risk & anomaly ──────────────────────────────────────────────
class RiskScoreRequest(BaseModel):
    experiment_id: UUID

class AnomalyRequest(BaseModel):
    experiment_id: UUID
    daily_visitor_counts: list[int]   # chronological, most recent last

# ── Schema for explainability ──────────────────────────────────────────────
class ExplainRequest(BaseModel):
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


# ── 7. Risk Score ─────────────────────────────────────────────────────────────

@router.post("/risk-score")
def risk_score(
    payload: RiskScoreRequest,
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
        variant_stats.append({
            "label": variant.label,
            "visitors": visitors,
            "traffic_split": 1 / len(experiment.variants)
        })

    total_visitors = sum(v["visitors"] for v in variant_stats)
    srm_result = srm_check(variant_stats) if variant_stats else {"mismatched": False}
    in_group = db.query(MutualExclusionMembership).filter(
        MutualExclusionMembership.experiment_id == experiment.id,
    ).first() is not None

    signals = compute_risk_signals(
        num_variants=len(experiment.variants),
        traffic_pct=100,  # wire to a real traffic_pct field if/when you add one to Experiment
        duration_days=experiment.planned_duration_days or 0,
        current_sample_size=total_visitors,
        target_sample_size=experiment.target_sample_size,
        is_in_mutual_exclusion_group=in_group,
        srm_flagged=srm_result.get("mismatched", False),
        has_guardrail_metric=False,  # wire to real per-experiment guardrail linkage once that exists
    )

    system = """You are summarizing pre-launch risk signals for an A/B test.
You are given a computed risk score and a list of specific reasons — DO NOT invent
any additional reasons, causes, or details not in the provided list. Only rephrase
and prioritize what's given, in plain English, in 2-3 sentences."""

    user_msg = f"Experiment: {experiment.name}\nRisk score: {signals['risk_score']}/100 ({signals['risk_level']})\nSignals: {json.dumps(signals['signals'])}"

    try:
        summary = chat(system, user_msg, max_tokens=200)
    except Exception:
        summary = None  # deterministic signals still returned even if AI phrasing fails

    return {**signals, "ai_summary": summary}


# ── 8. Anomaly Detection ──────────────────────────────────────────────────────

@router.post("/detect-anomaly")
def detect_anomaly(
    payload: AnomalyRequest,
    current_user: User = Depends(get_current_user),
):
    result = detect_traffic_anomaly(payload.daily_visitor_counts)

    if not result.get("anomalous"):
        return result

    system = """You are flagging a traffic anomaly in an A/B test to a product manager.
You are given a computed anomaly (z-score, direction, values) — DO NOT invent a cause.
List 2-3 PLAUSIBLE causes a human should check (e.g. tracking bug, bot traffic, deploy,
marketing campaign, external event) as things to investigate, not confirmed facts."""

    user_msg = json.dumps(result)

    try:
        raw = chat_json(system, user_msg)
        result["ai_investigation_suggestions"] = json.loads(raw)
    except Exception:
        pass

    return result


# ── 9. Explain Result – Funnel Breakdown & Divergence ───────────────────────

@router.post("/explain-result")
def explain_result(
    payload: ExplainRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    experiment = db.query(Experiment).filter(
        Experiment.id == payload.experiment_id,
        Experiment.owner_id == current_user.id,
    ).first()
    if not experiment:
        raise HTTPException(status_code=404, detail="Experiment not found")

    breakdown = build_funnel_breakdown(experiment.id, experiment.variants, db)
    divergences = find_largest_divergence(breakdown)

    system = """You are explaining A/B test results using ONLY the funnel event data provided.

STRICT RULES:
- You may ONLY reference the event types, rates, and numbers given to you.
- NEVER invent a design/UI cause (e.g. "the button was more visible", "the copy was clearer") —
  you were not shown the actual page and have no way to know this.
- If an event-level breakdown exists, point to WHICH step in the funnel diverged most
  between variants (e.g. "Variant B's add_to_cart rate is 8pp higher than control, but
  the gap closes by checkout — something between those two steps is worth investigating").
- If there isn't enough event-level data to explain WHY, say so explicitly rather than guessing.
- Never claim to know the underlying design reason — only describe the behavioral pattern in the data.

Return ONLY valid JSON:
{
  "summary": "...",
  "most_significant_divergence": "... or null if no event breakdown exists",
  "plain_english": "...",
  "confidence_note": "...",
  "data_limitation": "what this data CAN'T tell us, if anything"
}"""

    user_msg = f"""Experiment: {experiment.name}
Goal: {experiment.goal}
Variant breakdown: {json.dumps(breakdown)}
Largest rate divergences (variant vs control, per funnel step): {json.dumps(divergences[:5])}"""

    try:
        raw = chat_json(system, user_msg)
        ai_explanation = json.loads(raw)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI error: {str(e)}")

    return {
        "funnel_breakdown": breakdown,
        "top_divergences": divergences[:5],
        "ai_explanation": ai_explanation,
    }