import json
from app.agents.base import Agent


class SchedulingAgent(Agent):
    """Places open tasks into concrete time blocks respecting working hours,
    priorities and deadlines. Reschedules dynamically on every call."""

    name = "scheduling"
    system_prompt = (
        "You are the Scheduling Agent of an executive productivity assistant. "
        "Given the current time, the user's working hours, focus block length, "
        "a list of open tasks with priorities and deadlines, AND the user's "
        "existing calendar events, assign each task a concrete start and end "
        "time (ISO 8601). NEVER overlap an existing calendar event. Respect "
        "working hours, front-load urgent and deadline-sensitive work, avoid "
        "overloading any single day beyond the preferred capacity, and leave "
        "short breaks between focus blocks. For each block, give a short 'why' "
        "explaining the placement (e.g. 'Wednesday was already full, so moved "
        "to Thursday's free slot').\n\n"
        "Return ONLY valid JSON with this shape:\n"
        '{{"schedule": [{{"taskId": str, "start": str, "end": str, "why": str}}], '
        '"reasoning": str}}'
    )

    def schedule(self, context: dict) -> dict:
        user_input = (
            "Current context as JSON:\n"
            + json.dumps(context, default=str)
            + "\nProduce an optimal schedule for the open tasks."
        )
        return self.run(user_input)
