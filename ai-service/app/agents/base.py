import json
import re
from langchain_core.prompts import ChatPromptTemplate

from app.llm import get_llm


def _extract_json(text: str) -> dict:
    """Gemini sometimes wraps JSON in markdown fences or prose.
    Pull out the first JSON object so parsing stays robust."""
    text = text.strip()
    fenced = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", text, re.DOTALL)
    if fenced:
        return json.loads(fenced.group(1))
    brace = re.search(r"\{.*\}", text, re.DOTALL)
    if brace:
        return json.loads(brace.group(0))
    raise ValueError("No JSON object found in model output")


class Agent:
    """Base class for all productivity agents.

    Each agent owns a system prompt that defines its role and the exact JSON
    schema it must return. run() formats the prompt, calls Gemini, and parses
    the structured response.
    """

    name: str = "agent"
    system_prompt: str = ""
    temperature: float = 0.2

    def __init__(self):
        self.llm = get_llm(self.temperature)
        self.prompt = ChatPromptTemplate.from_messages(
            [("system", self.system_prompt), ("human", "{input}")]
        )

    def run(self, user_input: str) -> dict:
        chain = self.prompt | self.llm
        result = chain.invoke({"input": user_input})
        return _extract_json(result.content)
