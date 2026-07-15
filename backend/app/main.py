

# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware

# from app.database import Base, engine

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

# app = FastAPI(title="ExperimentX API", version="1.0")

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:5173"],  # TODO: update before deploy
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


# @app.get("/")
# def root():
#     return {"message": "ExperimentX API running"}














































# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# import os

# from app.database import Base, engine

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

# app = FastAPI(title="ExperimentX API", version="1.0")

# # Read allowed origins from env — defaults to localhost for dev
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


# @app.get("/")
# def root():
#     return {"message": "ExperimentX API running", "version": "1.0"}


# @app.get("/health")
# def health():
#     return {"status": "ok"}















# from fastapi import FastAPI, Request
# from fastapi.middleware.cors import CORSMiddleware
# from slowapi import Limiter, _rate_limit_exceeded_handler
# from slowapi.util import get_remote_address
# from slowapi.errors import RateLimitExceeded
# import os

# from app.database import Base, engine
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


# # Rate limiter
# limiter = Limiter(key_func=get_remote_address)

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


# @app.get("/")
# def root():
#     return {"message": "ExperimentX API running", "version": "1.0"}


# @app.get("/health")
# def health():
#     return {"status": "ok"}

























from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
import os

from app.database import Base, engine
from app.core.limiter import limiter

from app.models.user import User
from app.models.token import RefreshToken
from app.models.experiment import Experiment
from app.models.variant import Variant
from app.models.visitor import Visitor
from app.models.event import Event
from app.models.conversion import Conversion

from app.routes.auth import router as auth_router
from app.routes.experiments import router as experiments_router
from app.routes.assign import router as assign_router
from app.routes.event import router as event_router
from app.routes.analytics import router as analytics_router
from app.routes.ai import router as ai_router

app = FastAPI(title="ExperimentX API", version="1.0")

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

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

Base.metadata.create_all(bind=engine)

app.include_router(auth_router)
app.include_router(experiments_router)
app.include_router(assign_router)
app.include_router(event_router)
app.include_router(analytics_router)
app.include_router(ai_router)


@app.get("/")
def root():
    return {"message": "ExperimentX API running", "version": "1.0"}


@app.get("/health")
def health():
    return {"status": "ok"}