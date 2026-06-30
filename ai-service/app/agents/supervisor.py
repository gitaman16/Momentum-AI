from app.agents.planning_agent import PlanningAgent
from app.agents.scheduling_agent import SchedulingAgent
from app.agents.risk_agent import RiskAgent
from app.agents.coach_agent import CoachAgent


class Supervisor:
    """Owns the agent team and exposes a single entry point per capability.
    Agents are instantiated once and reused across requests.
    """

    def __init__(self):
        self.planning = PlanningAgent()
        self.scheduling = SchedulingAgent()
        self.risk = RiskAgent()
        self.coach = CoachAgent()

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


# Single shared supervisor for the process.
supervisor = Supervisor()
