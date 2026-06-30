import { Task } from "../models/Task.js";
import { Goal } from "../models/Goal.js";
import { User } from "../models/User.js";
import { AiInsight } from "../models/AiInsight.js";
import { callAgent } from "../services/aiClient.js";

// Builds the user context every agent needs: profile preferences plus the
// current open tasks and active goals.
async function buildContext(userId) {
  const [user, tasks, goals] = await Promise.all([
    User.findById(userId),
    Task.find({ user: userId, status: { $ne: "done" } }).sort({ deadline: 1 }),
    Goal.find({ user: userId, status: "active" })
  ]);

  return {
    user: {
      name: user.name,
      preferences: user.preferences,
      now: new Date().toISOString()
    },
    tasks: tasks.map((t) => ({
      id: t._id.toString(),
      title: t.title,
      priority: t.priority,
      status: t.status,
      estimatedMinutes: t.estimatedMinutes,
      deadline: t.deadline,
      scheduledStart: t.scheduledStart
    })),
    goals: goals.map((g) => ({
      id: g._id.toString(),
      title: g.title,
      description: g.description,
      deadline: g.deadline
    }))
  };
}

// Planning Agent: decompose a goal into estimated subtasks and persist them.
export async function planGoal(req, res) {
  const goal = await Goal.findOne({ _id: req.params.goalId, user: req.user.id });
  if (!goal) return res.status(404).json({ error: "Goal not found" });

  const result = await callAgent("/agents/plan", {
    goal: { title: goal.title, description: goal.description, deadline: goal.deadline }
  });

  const created = await Task.insertMany(
    (result.subtasks || []).map((s) => ({
      user: req.user.id,
      goal: goal._id,
      title: s.title,
      description: s.description || "",
      priority: s.priority || "medium",
      estimatedMinutes: s.estimatedMinutes || 30,
      aiGenerated: true
    }))
  );

  res.json({ subtasks: created, reasoning: result.reasoning });
}

// Scheduling Agent: assign time blocks to open tasks and persist the schedule.
export async function scheduleTasks(req, res) {
  const context = await buildContext(req.user.id);
  const result = await callAgent("/agents/schedule", context);

  await Promise.all(
    (result.schedule || []).map((block) =>
      Task.findOneAndUpdate(
        { _id: block.taskId, user: req.user.id },
        { scheduledStart: block.start, scheduledEnd: block.end }
      )
    )
  );

  res.json({ schedule: result.schedule, reasoning: result.reasoning });
}

// Risk Analysis Agent: score tasks for missed-deadline risk and procrastination.
export async function analyzeRisk(req, res) {
  const context = await buildContext(req.user.id);
  const result = await callAgent("/agents/risk", context);

  await Promise.all(
    (result.risks || []).map((r) =>
      Task.findOneAndUpdate({ _id: r.taskId, user: req.user.id }, { riskScore: r.score })
    )
  );

  const insight = await AiInsight.create({
    user: req.user.id,
    type: "risk_report",
    summary: result.summary || "",
    data: result
  });

  res.json({ report: result, insightId: insight._id });
}

// Productivity Coach: daily plan.
export async function dailyPlan(req, res) {
  const context = await buildContext(req.user.id);
  const result = await callAgent("/agents/daily-plan", context);

  const insight = await AiInsight.create({
    user: req.user.id,
    type: "daily_plan",
    summary: result.summary || "",
    data: result
  });

  res.json({ plan: result, insightId: insight._id });
}

// Productivity Coach: weekly review using completed-task history.
export async function weeklyReview(req, res) {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const [context, completed] = await Promise.all([
    buildContext(req.user.id),
    Task.find({ user: req.user.id, status: "done", completedAt: { $gte: weekAgo } })
  ]);

  const result = await callAgent("/agents/weekly-review", {
    ...context,
    completed: completed.map((t) => ({
      title: t.title,
      estimatedMinutes: t.estimatedMinutes,
      actualMinutes: t.actualMinutes,
      completedAt: t.completedAt
    }))
  });

  const insight = await AiInsight.create({
    user: req.user.id,
    type: "weekly_review",
    summary: result.summary || "",
    data: result
  });

  res.json({ review: result, insightId: insight._id });
}

export async function listInsights(req, res) {
  const insights = await AiInsight.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .limit(50);
  res.json({ insights });
}
