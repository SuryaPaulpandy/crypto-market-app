from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

connect_args = {}
if not DATABASE_URL or not DATABASE_URL.startswith("postgresql"):
    DATABASE_URL = "sqlite:///./crypto.db"
    connect_args = {"check_same_thread": False}

try:
    engine = create_engine(DATABASE_URL, connect_args=connect_args)
    with engine.connect() as conn:
        pass
except Exception as e:
    print(f"Warning: Failed to connect to DB at {DATABASE_URL} ({e}). Falling back to SQLite.")
    DATABASE_URL = "sqlite:///./crypto.db"
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()