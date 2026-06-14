from fastapi import APIRouter
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.analytics.analytics import calculate_analytics

router = APIRouter()


@router.get("/analytics")

async def get_analytics():

    db: Session = SessionLocal()

    data = calculate_analytics(db)

    db.close()

    return data