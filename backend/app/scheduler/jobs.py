from apscheduler.schedulers.background import BackgroundScheduler
from app.services.coingecko_service import fetch_market_data
from app.database import SessionLocal
from app.models import MarketData
import asyncio
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("app.scheduler")

def ingest_market_data_job():
    logger.info("Scheduler: Starting background market data ingestion...")
    db = SessionLocal()
    try:
        data = asyncio.run(fetch_market_data())
        
        saved_count = 0
        for coin in data:
            market = MarketData(
                symbol=coin["symbol"].upper(),
                price=coin["current_price"],
                volume=coin["total_volume"]
            )
            db.add(market)
            saved_count += 1
            
        db.commit()
        logger.info(f"Scheduler: Successfully ingested and saved {saved_count} crypto assets.")
    except Exception as e:
        db.rollback()
        logger.error(f"Scheduler Error during ingestion: {e}")
    finally:
        db.close()

scheduler = BackgroundScheduler()

def start_scheduler():
    logger.info("Initializing APScheduler Background Jobs...")
    scheduler.add_job(ingest_market_data_job, 'interval', minutes=5, id='coingecko_ingestion', replace_existing=True)
    scheduler.add_job(ingest_market_data_job, 'date', id='coingecko_immediate')
    scheduler.start()
    logger.info("APScheduler started successfully.")
