import os

from dotenv import load_dotenv


BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))

load_dotenv(os.path.join(BASE_DIR, ".env"))


DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg2://postgres:Sa006011@localhost:5432/rutrip",
)

SECRET_KEY = os.getenv(
    "SECRET_KEY",
    "your-secret-key-change-in-production",
)

ALGORITHM = os.getenv("ALGORITHM", "HS256")

ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30)
)

REFRESH_TOKEN_EXPIRE_DAYS = int(
    os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", 7)
)

ML_SERVICE_URL = os.getenv(
    "ML_SERVICE_URL",
    "http://ml_module:8001",
)
REDIS_URL = os.getenv(
    "REDIS_URL",
    "redis://redis:6379/0",
)

AI_CACHE_TTL_SECONDS = int(
    os.getenv("AI_CACHE_TTL_SECONDS", 3600)
)