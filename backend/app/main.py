

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine

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

app = FastAPI(title="ExperimentX API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # TODO: update before deploy
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


@app.get("/")
def root():
    return {"message": "ExperimentX API running"}