from fastapi import APIRouter, HTTPException

from app.schemas import PlanRequest, Context
from app.agents.supervisor import supervisor

router = APIRouter(prefix="/agents", tags=["agents"])


@router.post("/plan")
def plan(req: PlanRequest):
    try:
        return supervisor.plan_goal(req.goal.model_dump())
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Planning failed: {e}")


@router.post("/schedule")
def schedule(ctx: Context):
    try:
        return supervisor.schedule(ctx.model_dump())
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Scheduling failed: {e}")


@router.post("/risk")
def risk(ctx: Context):
    try:
        return supervisor.analyze_risk(ctx.model_dump())
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Risk analysis failed: {e}")


@router.post("/daily-plan")
def daily_plan(ctx: Context):
    try:
        return supervisor.daily_plan(ctx.model_dump())
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Daily plan failed: {e}")


@router.post("/weekly-review")
def weekly_review(ctx: Context):
    try:
        return supervisor.weekly_review(ctx.model_dump())
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Weekly review failed: {e}")
