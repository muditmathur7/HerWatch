from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings

def create_db_engine():
    engine_kwargs = {}
    if settings.DATABASE_URL.startswith("sqlite"):
        engine_kwargs["connect_args"] = {"check_same_thread": False}
        return create_engine(settings.DATABASE_URL, **engine_kwargs)
    
    # Try connecting to MySQL
    engine_kwargs["pool_pre_ping"] = True
    engine_kwargs["pool_recycle"] = 3600
    try:
        eng = create_engine(settings.DATABASE_URL, **engine_kwargs)
        with eng.connect() as conn:
            pass
        print(f"✓ Connected successfully to MySQL database")
        return eng
    except Exception as e:
        print("\n" + "=" * 65)
        print("⚠️  [HERWATCH DB NOTICE]")
        print(f"Could not connect to MySQL: {e}")
        print("-> Automatically falling back to local SQLite database (herwatch.db).")
        print("-> To use MySQL, set your correct MySQL password in herwatch-backend/.env")
        print("=" * 65 + "\n")
        fallback_url = "sqlite:///./herwatch.db"
        return create_engine(fallback_url, connect_args={"check_same_thread": False})

engine = create_db_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
