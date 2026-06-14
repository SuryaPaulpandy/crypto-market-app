from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine
from .models import Base

from app.routes.market_routes import router as market_router
from app.routes.analytics_routes import router as analytics_router
from app.routes.strategy_routes import router as strategy_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

from app.scheduler.jobs import start_scheduler

@app.on_event("startup")
async def startup_event():
    start_scheduler()

app.include_router(market_router)
app.include_router(analytics_router)
app.include_router(strategy_router)

@app.get("/")
async def home():

    return {
        "message": "Crypto Market API Running"
    }