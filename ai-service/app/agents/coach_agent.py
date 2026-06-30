import json
from app.agents.base import Agent


class CoachAgent(Agent):
    """The Productivity Coach: generates daily plans and weekly reviews, and
    explains the reasoning so the assistant feels human, not robotic."""

    name = "coach"
    temperature = 0.4

    daily_prompt = (
        "You are the Productivity Coach of an executive assistant. Using the "
        "current time, working hours and open tasks, produce a focused plan for "
        "TODAY. Pick the few tasks that matter most, assign each a human-readable "
        "time block, and explain briefly why each was chosen. End with one "
        "actionable focus tip. Be warm, direct and motivating.\n\n"
        "Return ONLY valid JSON with this shape:\n"
        '{{"items": [{{"taskId": str, "title": str, "timeBlock": str, "why": str}}], '
        '"focusTip": str, "summary": str}}'
    )

    weekly_prompt = (
        "You are the Productivity Coach of an executive assistant. Given the "
        "tasks completed this week (with estimated vs actual minutes) and the "
        "remaining workload, write a weekly review: celebrate wins, name misses "
        "honestly, surface 2-4 data-driven insights (e.g. estimation accuracy, "
        "procrastination patterns), and recommend next week's focus. Be "
        "encouraging but candid.\n\n"
        "Return ONLY valid JSON with this shape:\n"
        '{{"wins": [str], "misses": [str], "insights": [str], '
        '"nextWeekFocus": [str], "summary": str}}'
    )

    def daily_plan(self, context: dict) -> dict:
        self.system_prompt = self.daily_prompt
        self._rebuild_prompt()
        return self.run("Context:\n" + json.dumps(context, default=str))

    def weekly_review(self, context: dict) -> dict:
        self.system_prompt = self.weekly_prompt
        self._rebuild_prompt()
        return self.run("Context:\n" + json.dumps(context, default=str))

    def _rebuild_prompt(self):
        from langchain_core.prompts import ChatPromptTemplate

        self.prompt = ChatPromptTemplate.from_messages(
            [("system", self.system_prompt), ("human", "{input}")]
        )
