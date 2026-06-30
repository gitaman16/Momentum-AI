from datetime import datetime, timezone

from app.agents.planning_agent import PlanningAgent
from app.agents.scheduling_agent import SchedulingAgent
from app.agents.risk_agent import RiskAgent
from app.agents.coach_agent import CoachAgent
from app.agents.intake_agent import IntakeAgent


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


class Supervisor:
    """Owns the agent team and exposes a single entry point per capability.
    Agents are instantiated once and reused across requests.
    """

    def __init__(self):
        self.planning = PlanningAgent()
        self.scheduling = SchedulingAgent()
        self.risk = RiskAgent()
        self.coach = CoachAgent()
        self.intake = IntakeAgent()

    def plan_goal(self, goal: dict) -> dict:
        return self.planning.plan(goal)

    def schedule(self, context: dict) -> dict:
        return self.scheduling.schedule(context)

    def analyze_risk(self, context: dict) -> dict:
        return self.risk.analyze(context)

    def daily_plan(self, context: dict) -> dict:
        return self.coach.daily_plan(context)

    def weekly_review(self, context: dict) -> dict:
        return self.coach.weekly_review(context)

    def intake_goal(self, text: str, now: str) -> dict:
        return self.intake.parse(text, now)

    def autopilot(self, context: dict) -> dict:
        """Run the full multi-agent workflow in one pass. Each step records a
        timeline entry so the frontend can show the agent collaboration.
        Steps degrade gracefully: a failing agent does not abort the run."""
        timeline = []

        def step(agent: str, action: str, fn):
            entry = {
                "timestamp": _now_iso(),
                "agent": agent,
                "action": action,
            }
            try:
                result = fn()
                entry["explanation"] = result.get("reasoning") or result.get("summary") or "Completed."
                entry["result"] = result
            except Exception as e:
                entry["explanation"] = f"Skipped: {e}"
                entry["result"] = {}
            timeline.append(entry)
            return entry["result"]

        timeline.append({
            "timestamp": _now_iso(),
            "agent": "Supervisor",
            "action": "Coordinating agents",
            "explanation": "Analyzing your workload, then delegating to specialist agents.",
            "result": {},
        })

        schedule = step("Scheduling Agent", "Optimizing schedule", lambda: self.scheduling.schedule(context))
        risk = step("Risk Analysis Agent", "Scoring deadline risk", lambda: self.risk.analyze(context))
        plan = step("Productivity Coach", "Building Today's Focus", lambda: self.coach.daily_plan(context))

        return {
            "timeline": timeline,
            "schedule": schedule.get("schedule", []),
            "scheduleReasoning": schedule.get("reasoning", ""),
            "risks": risk.get("risks", []),
            "procrastinationSignals": risk.get("procrastinationSignals", []),
            "successPredictions": risk.get("successPredictions", []),
            "riskSummary": risk.get("summary", ""),
            "todaysFocus": plan.get("items", []),
            "focusTip": plan.get("focusTip", ""),
            "recommendations": risk.get("recommendations", []) + plan.get("recommendations", []),
            "summary": plan.get("summary", ""),
        }


# Single shared supervisor for the process.
supervisor = Supervisor()
