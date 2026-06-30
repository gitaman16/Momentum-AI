import json
from app.agents.base import Agent


class PlanningAgent(Agent):
    """Decomposes a high-level goal into concrete, estimated subtasks."""

    name = "planning"
    system_prompt = (
        "You are the Planning Agent of an executive productivity assistant. "
        "Given a goal, break it into 3-8 concrete, actionable subtasks ordered "
        "logically. Estimate realistic effort in minutes and assign a priority "
        "(low, medium, high, urgent). Be specific and practical.\n\n"
        "Return ONLY valid JSON with this shape:\n"
        '{{"subtasks": [{{"title": str, "description": str, '
        '"priority": str, "estimatedMinutes": int}}], "reasoning": str}}'
    )

    def plan(self, goal: dict) -> dict:
        user_input = (
            f"Goal title: {goal.get('title')}\n"
            f"Description: {goal.get('description', '')}\n"
            f"Deadline: {goal.get('deadline', 'none')}\n"
            "Decompose this goal into subtasks."
        )
        return self.run(user_input)
