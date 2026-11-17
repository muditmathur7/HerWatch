from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings
import logging

logger = logging.getLogger(__name__)

# Engine configuration
# Note: For SQLite fallback or MySQL with pymysql
engine_kwargs = {}
if settings.DATABASE_URL.startswith("sqlite"):
    engine_kwargs["connect_args"] = {"check_same_thread": False}
else:
    engine_kwargs["pool_pre_ping"] = True
    engine_kwargs["pool_recycle"] = 3600

try:
    engine = create_engine(settings.DATABASE_URL, **engine_kwargs)
except Exception as e:
    logger.error(f"Failed to create database engine with URL {settings.DATABASE_URL}: {e}")
    # Fallback to local sqlite if MySQL is unreachable during initial dev
    fallback_url = "sqlite:///./herwatch.db"
    logger.warning(f"Falling back to SQLite database at {fallback_url}")
    engine = create_engine(fallback_url, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
