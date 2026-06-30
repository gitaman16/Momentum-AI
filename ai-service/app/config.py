import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    """Central place for environment-driven configuration."""

    gemini_api_key: str = os.getenv("GEMINI_API_KEY", "")
    gemini_model: str = (os.getenv("GEMINI_MODEL", "gemini-2.5-flash") or "gemini-2.5-flash").strip()
    port: int = int(os.getenv("PORT", "8000"))
    cors_allowed_origins: list[str] = [
        origin.strip() for origin in os.getenv("CORS_ALLOWED_ORIGINS", "*").split(",") if origin.strip()
    ]


settings = Settings()
