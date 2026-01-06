# cors/config.py

from dotenv import load_dotenv
import os

load_dotenv()

class Settings:
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "dev-secret")
    JWT_ALGORITHM: str = "HS256"
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY")

settings = Settings()
