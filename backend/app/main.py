# from fastapi import FastAPI, Request
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import JSONResponse
# from slowapi import _rate_limit_exceeded_handler
# from slowapi.errors import RateLimitExceeded
# import os

# from app.database import Base, engine
# from app.core.limiter import limiter

# from app.models.user import User
# from app.models.token import RefreshToken
# from app.models.experiment import Experiment
# from app.models.variant import Variant
# from app.models.visitor import Visitor
# from app.models.event import Event
# from app.models.conversion import Conversion

# from app.routes.auth import router as auth_router
# from app.routes.experiments import router as experiments_router
# from app.routes.assign import router as assign_router
# from app.routes.event import router as event_router
# from app.routes.analytics import router as analytics_router
# from app.routes.ai import router as ai_router
# from app.models.feature_flag import FeatureFlag
# from app.routes.flags import router as flags_router
# from app.models.mutual_exclusion import MutualExclusionGroup, MutualExclusionMembership
# from app.routes.mutual_exclusion import router as mutual_exclusion_router
# from app.models.holdout import HoldoutGroup, HoldoutVisitor, HoldoutConversion
# from app.routes.holdout import router as holdout_router
# from app.models.metric import Metric
# from app.routes.metrics import router as metrics_router
# from app.core.scheduler import start_scheduler, stop_scheduler
# from contextlib import asynccontextmanager

# app = FastAPI(lifespan=lifespan)
# app = FastAPI(title="ExperimentX API", version="1.0")

# app.state.limiter = limiter
# app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ALLOWED_ORIGINS = os.getenv(
#     "ALLOWED_ORIGINS",
#     "http://localhost:5173,http://localhost:3000"
# ).split(",")

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=ALLOWED_ORIGINS,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# Base.metadata.create_all(bind=engine)

# app.include_router(auth_router)
# app.include_router(experiments_router)
# app.include_router(assign_router)
# app.include_router(event_router)
# app.include_router(analytics_router)
# app.include_router(ai_router)
# app.include_router(flags_router)
# app.include_router(mutual_exclusion_router)
# app.include_router(holdout_router)
# app.include_router(metrics_router)


# @app.get("/")
# def root():
#     return {"message": "ExperimentX API running", "version": "1.0"}


# @app.get("/health")
# def health():
#     return {"status": "ok"}


# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     # ── STARTUP (runs before the app starts serving) ──────────────────
#     print("Starting up...")
#     # e.g., create database tables, init Redis, load ML models, etc.
#     # If you had multiple @app.on_event("startup") functions, call them here.
    
#     yield  # The application runs here
    
#     # ── SHUTDOWN (runs when the app is shutting down) ──────────────────
#     print("Shutting down...")
#     # e.g., close DB connections, clean up resources.


# @app.on_event("startup")
# def on_startup():
#     start_scheduler()


# @app.on_event("shutdown")
# def on_shutdown():
#     stop_scheduler()





























from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
import os
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
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:3000"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Create database tables (if not using Alembic in production) ────────────
Base.metadata.create_all(bind=engine)

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

# ── Health & root endpoints ──────────────────────────────────────────────────
@app.get("/")
def root():
    return {"message": "ExperimentX API running", "version": "1.0"}


@app.get("/health")
def health():
    return {"status": "ok"}