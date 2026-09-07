from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
import os
import logging
import time
from sqlalchemy import text
from contextlib import asynccontextmanager
from app.models.organization import Organization, Membership
from app.routes.organizations import router as organizations_router
from app.database import Base, engine
from app.core.limiter import limiter
from app.core.scheduler import start_scheduler, stop_scheduler

# Import models so Alembic/metadata picks them up
from app.models.user import User
from app.models.token import RefreshToken
from app.models.experiment import Experiment
from app.models.variant import Variant
from app.models.visitor import Visitor
from app.models.event import Event
from app.models.conversion import Conversion
from app.models.feature_flag import FeatureFlag
from app.models.mutual_exclusion import MutualExclusionGroup, MutualExclusionMembership
from app.models.holdout import HoldoutGroup, HoldoutVisitor, HoldoutConversion
from app.models.metric import Metric
from app.models.api_key import ApiKey
from app.models.experiment_guardrail import ExperimentGuardrail
# Import routers
from app.routes.auth import router as auth_router
from app.routes.experiments import router as experiments_router
from app.routes.assign import router as assign_router
from app.routes.event import router as event_router
from app.routes.analytics import router as analytics_router
from app.routes.ai import router as ai_router
from app.routes.flags import router as flags_router
from app.routes.mutual_exclusion import router as mutual_exclusion_router
from app.routes.holdout import router as holdout_router
from app.routes.metrics import router as metrics_router
from app.routes import ml
from app.routes import advanced_stats
from app.routes.api_keys import router as api_keys_router
from app.routes.webhook_settings import router as webhook_settings_router
from app.routes.guardrails import router as guardrails_router

# ── Lifespan context manager (replaces startup/shutdown events) ──────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    # ─── STARTUP ──────────────────────────────────────────────────────────────
    print("Starting up ExperimentX API...")
    # Start background scheduler (e.g., for report generation)
    start_scheduler()
    yield
    # ─── SHUTDOWN ──────────────────────────────────────────────────────────────
    print("Shutting down ExperimentX API...")
    stop_scheduler()


# ── Create FastAPI app with lifespan ─────────────────────────────────────────
app = FastAPI(
    title="ExperimentX API",
    version="1.0",
    lifespan=lifespan,
)

# ── Rate limiting ──────────────────────────────────────────────────────────────
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ── CORS ──────────────────────────────────────────────────────────────────────
# ALLOWED_ORIGINS = os.getenv(
#     "ALLOWED_ORIGINS",
#     "http://localhost:5173, http://localhost:3000 , http://localhost:5500"
# ).split(",")

ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:5173,http://localhost:3000,http://localhost:5500"
    ).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Logging ───────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=os.getenv("LOG_LEVEL", "INFO"),
    format="%(asctime)s level=%(levelname)s logger=%(name)s msg=%(message)s",
)
logger = logging.getLogger("experimentx.api")


# ── Request logging ───────────────────────────────────────────────────────────
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.perf_counter()
    try:
        response = await call_next(request)
    except Exception:
        duration_ms = round((time.perf_counter() - start) * 1000, 1)
        logger.exception(
            f"method={request.method} path={request.url.path} "
            f"status=500 duration_ms={duration_ms} unhandled_exception=true"
        )
        raise
    duration_ms = round((time.perf_counter() - start) * 1000, 1)
    log_line = (
        f"method={request.method} path={request.url.path} "
        f"status={response.status_code} duration_ms={duration_ms}"
    )
    if response.status_code >= 500:
        logger.error(log_line)
    elif response.status_code >= 400:
        logger.warning(log_line)
    else:
        logger.info(log_line)
    return response

# ── Create database tables (if not using Alembic in production) ────────────
# Base.metadata.create_all(bind=engine)


# ── Include routers ──────────────────────────────────────────────────────────
app.include_router(auth_router)
app.include_router(experiments_router)
app.include_router(assign_router)
app.include_router(event_router)
app.include_router(analytics_router)
app.include_router(ai_router)
app.include_router(flags_router)
app.include_router(mutual_exclusion_router)
app.include_router(holdout_router)
app.include_router(metrics_router)
app.include_router(organizations_router)
app.include_router(ml.router)
app.include_router(advanced_stats.router)
app.include_router(api_keys_router)
app.include_router(webhook_settings_router)
app.include_router(guardrails_router)

# ── Health & root endpoints ──────────────────────────────────────────────────
@app.get("/")
def root():
    return {"message": "ExperimentX API running", "version": "1.0"}


@app.get("/health/live")
def health_live():
    """Liveness — process is up. No dependency checks; must stay cheap."""
    return {"status": "ok"}


@app.get("/health")
def health():
    """Readiness — safe to receive traffic. Checks the DB."""
    checks = {}
    healthy = True
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        checks["database"] = "ok"
    except Exception as e:
        logger.error(f"health check: database unreachable: {e}")
        checks["database"] = "unreachable"
        healthy = False

    status_code = 200 if healthy else 503
    return JSONResponse(
        status_code=status_code,
        content={"status": "ok" if healthy else "degraded", "checks": checks},
    )