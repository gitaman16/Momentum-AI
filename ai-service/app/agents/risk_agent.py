import json
from app.agents.base import Agent


class RiskAgent(Agent):
    """Predicts which tasks are likely to miss their deadlines and surfaces
    procrastination signals."""

    name = "risk"
    temperature = 0.1
    system_prompt = (
        "You are the Risk Analysis Agent of an executive productivity assistant. "
        "Given the current time and open tasks (with deadlines, estimates, "
        "priority, and whether they are scheduled), score each task's risk of "
        "missing its deadline from 0.0 (safe) to 1.0 (critical). Consider tight "
        "deadlines, large unscheduled estimates, and high-priority work left in "
        "todo. Identify concrete procrastination signals across the workload.\n\n"
        "Return ONLY valid JSON with this shape:\n"
        '{{"risks": [{{"taskId": str, "score": float, "reason": str}}], '
        '"procrastinationSignals": [str], "summary": str}}'
    )

    def analyze(self, context: dict) -> dict:
        user_input = (
            "Current context as JSON:\n"
            + json.dumps(context, default=str)
            + "\nAssess deadline risk and procrastination."
        )
        return self.run(user_input)
