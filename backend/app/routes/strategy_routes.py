from fastapi import APIRouter
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.strategy.moving_average import run_strategy

router = APIRouter()


@router.get("/strategy/results")
async def strategy_results():
    db: Session = SessionLocal()
    try:
        data = run_strategy(db)
        return data
    finally:
        db.close()


@router.post("/strategy/run")
async def strategy_run():
    db: Session = SessionLocal()
    try:
        data = run_strategy(db)
        return {
            "status": "success",
            "message": "Strategy processed successfully",
            "results": data
        }
    finally:
        db.close()