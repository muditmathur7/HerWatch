from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "HerWatch API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Security
    SECRET_KEY: str = "herwatch-super-secure-secret-key-change-in-production-2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database
    # Default MySQL URL: mysql+pymysql://<user>:<password>@<host>:<port>/<dbname>
    DATABASE_URL: str = "mysql+pymysql://root:password@localhost:3306/herwatch"
    
    # CORS Origins (allow Angular frontend on 4200 and standard local ports)
    CORS_ORIGINS: List[str] = [
        "http://localhost:4200",
        "http://127.0.0.1:4200",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ]
    
    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
