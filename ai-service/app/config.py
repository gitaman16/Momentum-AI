import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    """Central place for environment-driven configuration."""

    gemini_api_key: str = os.getenv("GEMINI_API_KEY", "")
    gemini_model: str = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
    port: int = int(os.getenv("PORT", "8000"))


settings = Settings()
