from fastapi import APIRouter, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.services.coingecko_service import fetch_market_data
from app.database import SessionLocal
from app.models import MarketData

router = APIRouter()


@router.get("/markets")
async def get_markets():
    data = await fetch_market_data()
    db: Session = SessionLocal()
    try:
        saved_coins = []
        for coin in data:
            market = MarketData(
                symbol=coin["symbol"].upper(),
                price=coin["current_price"],
                volume=coin["total_volume"]
            )
            db.add(market)
            saved_coins.append({
                "symbol": market.symbol,
                "price": market.price,
                "volume": market.volume
            })
        db.commit()
        return {
            "message": "Market data saved successfully",
            "coins": len(data),
            "data": saved_coins
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()


@router.get("/prices")
async def get_prices(symbol: str = None):
    db: Session = SessionLocal()
    try:
        if symbol:
            latest = db.query(MarketData).filter(
                MarketData.symbol == symbol.upper()
            ).order_by(MarketData.timestamp.desc()).first()
            if not latest:
                raise HTTPException(status_code=404, detail=f"No price data found for symbol {symbol}")
            return {
                "symbol": latest.symbol,
                "price": latest.price,
                "volume": latest.volume,
                "timestamp": latest.timestamp.isoformat()
            }
        else:
            subq = db.query(
                MarketData.symbol,
                func.max(MarketData.timestamp).label("max_ts")
            ).group_by(MarketData.symbol).subquery()
            
            latest_records = db.query(MarketData).join(
                subq,
                (MarketData.symbol == subq.c.symbol) & (MarketData.timestamp == subq.c.max_ts)
            ).all()
            
            return [
                {
                    "symbol": item.symbol,
                    "price": item.price,
                    "volume": item.volume,
                    "timestamp": item.timestamp.isoformat()
                }
                for item in latest_records
            ]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connectivity failed: {str(e)}")
    finally:
        db.close()


@router.get("/history")
async def get_history(symbol: str, limit: int = 100):
    db: Session = SessionLocal()
    try:
        records = db.query(MarketData).filter(
            MarketData.symbol == symbol.upper()
        ).order_by(MarketData.timestamp.desc()).limit(limit).all()
        records.reverse()
        
        return [
            {
                "symbol": item.symbol,
                "price": item.price,
                "volume": item.volume,
                "timestamp": item.timestamp.isoformat()
            }
            for item in records
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to query market history: {str(e)}")
    finally:
        db.close()