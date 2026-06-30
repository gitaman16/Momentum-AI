from typing import Any, List, Optional
from pydantic import BaseModel


# ---- Shared context shapes (mirror what the backend sends) ----


class UserContext(BaseModel):
    name: str
    preferences: dict = {}
    now: str


class TaskContext(BaseModel):
    id: str
    title: str
    priority: str = "medium"
    status: str = "todo"
    estimatedMinutes: int = 30
    deadline: Optional[str] = None
    scheduledStart: Optional[str] = None


class GoalContext(BaseModel):
    id: str
    title: str
    description: str = ""
    deadline: Optional[str] = None


class CompletedTask(BaseModel):
    title: str
    estimatedMinutes: int = 0
    actualMinutes: int = 0
    completedAt: Optional[str] = None


class Context(BaseModel):
    user: UserContext
    tasks: List[TaskContext] = []
    goals: List[GoalContext] = []
    completed: List[CompletedTask] = []


# ---- Request payloads ----


class GoalInput(BaseModel):
    title: str
    description: Optional[str] = ""
    deadline: Optional[str] = None


class PlanRequest(BaseModel):
    goal: GoalInput


# ---- Agent outputs ----


class Subtask(BaseModel):
    title: str
    description: str = ""
    priority: str = "medium"
    estimatedMinutes: int = 30


class PlanResponse(BaseModel):
    subtasks: List[Subtask]
    reasoning: str


class ScheduleBlock(BaseModel):
    taskId: str
    start: str
    end: str


class ScheduleResponse(BaseModel):
    schedule: List[ScheduleBlock]
    reasoning: str


class RiskItem(BaseModel):
    taskId: str
    score: float
    reason: str


class RiskResponse(BaseModel):
    risks: List[RiskItem]
    procrastinationSignals: List[str] = []
    summary: str


class PlanItem(BaseModel):
    taskId: Optional[str] = None
    title: str
    timeBlock: str
    why: str


class DailyPlanResponse(BaseModel):
    items: List[PlanItem]
    focusTip: str
    summary: str


class WeeklyReviewResponse(BaseModel):
    wins: List[str]
    misses: List[str]
    insights: List[str]
    nextWeekFocus: List[str]
    summary: str
