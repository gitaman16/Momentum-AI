import json
from app.agents.base import Agent


class IntakeAgent(Agent):
    """Natural-language goal intake. Turns a free-text sentence like
    'I have an AI assignment due next Friday that should take ~10 hours'
    into a structured goal with an ISO deadline and effort estimate."""

    name = "intake"
    temperature = 0.1
    system_prompt = (
        "You are the Intake Agent of Momentum AI, an executive productivity "
        "assistant. The user describes work in plain language. Extract a "
        "structured goal. Resolve relative dates (e.g. 'next Friday') into an "
        "absolute ISO 8601 date using the provided current time. If the user "
        "gives a total effort (e.g. '10 hours'), convert it to minutes. If "
        "effort is missing, estimate it reasonably. Always explain your "
        "interpretation.\n\n"
        "Return ONLY valid JSON with this shape:\n"
        '{{"title": str, "description": str, "deadline": str|null, '
        '"estimatedMinutes": int, "explanation": str, "confidence": float}}'
    )

    def parse(self, text: str, now: str) -> dict:
        user_input = f"Current time: {now}\nUser said: {text}"
        return self.run(user_input)
