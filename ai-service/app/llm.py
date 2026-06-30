from langchain_google_genai import ChatGoogleGenerativeAI

from app.config import settings

# A single shared LLM instance. Low temperature keeps planning/scheduling
# deterministic and reliable, which matters for an assistant users trust.
_llm = None


def get_llm(temperature: float = 0.2) -> ChatGoogleGenerativeAI:
    global _llm
    if _llm is None:
        _llm = ChatGoogleGenerativeAI(
            model=settings.gemini_model,
            google_api_key=settings.gemini_api_key,
            temperature=temperature,
        )
    return _llm
