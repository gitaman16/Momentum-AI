import { Task } from "../models/Task.js";
import { Goal } from "../models/Goal.js";
import { AiInsight } from "../models/AiInsight.js";
import { AutopilotState } from "../models/AutopilotState.js";
import { callAgent } from "../services/aiClient.js";
import { buildContext, runAutopilot } from "../services/autopilotService.js";

function aiServiceError(message) {
  const error = new Error(message);
  error.status = 502;
  return error;
}

async function callAgentSafe(endpoint, payload) {
  try {
    return await callAgent(endpoint, payload);
  } catch (error) {
    const detail = error?.response?.data?.detail || error.message || "AI service unavailable";
    throw aiServiceError(`AI service unavailable: ${detail}`);
  }
}

// Planning Agent: decompose a goal into estimated subtasks and persist them.
export async function planGoal(req, res) {
  const goal = await Goal.findOne({ _id: req.params.goalId, user: req.user.id });
  if (!goal) return res.status(404).json({ error: "Goal not found" });

  const result = await callAgentSafe("/agents/plan", {
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
  const result = await callAgentSafe("/agents/schedule", context);

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
  const result = await callAgentSafe("/agents/risk", context);

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
  const result = await callAgentSafe("/agents/daily-plan", context);

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

  const result = await callAgentSafe("/agents/weekly-review", {
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

// Force a fresh autopilot run and return the persisted state.
export async function autopilotNow(req, res) {
  const state = await runAutopilot(req.user.id);
  res.json({ state });
}

// Return the latest stored autopilot state without re-running the AI.
export async function getAutopilotState(req, res) {
  const state = await AutopilotState.findOne({ user: req.user.id });
  res.json({ state });
}

// Natural-language goal creation: parse text -> goal -> subtasks -> autopilot.
export async function intakeGoal(req, res) {
  const { text } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: "text is required" });
  }

  const parsed = await callAgentSafe("/agents/intake", {
    text,
    now: new Date().toISOString()
  });

  const goal = await Goal.create({
    user: req.user.id,
    title: parsed.title,
    description: parsed.description || "",
    deadline: parsed.deadline || null
  });

  // Immediately decompose the new goal into subtasks.
  const plan = await callAgentSafe("/agents/plan", {
    goal: { title: goal.title, description: goal.description, deadline: goal.deadline }
  });
  const subtasks = await Task.insertMany(
    (plan.subtasks || []).map((s) => ({
      user: req.user.id,
      goal: goal._id,
      title: s.title,
      description: s.description || "",
      priority: s.priority || "medium",
      estimatedMinutes: s.estimatedMinutes || 30,
      aiGenerated: true
    }))
  );

  // Run the full workflow so Today's Focus, schedule and risk are ready at once.
  const state = await runAutopilot(req.user.id);

  res.status(201).json({
    goal,
    subtasks,
    explanation: parsed.explanation || "",
    confidence: parsed.confidence ?? null,
    planReasoning: plan.reasoning || "",
    state
  });
}
