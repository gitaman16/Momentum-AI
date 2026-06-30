import { Task } from "../models/Task.js";
import { Goal } from "../models/Goal.js";
import { User } from "../models/User.js";
import { AutopilotState } from "../models/AutopilotState.js";
import { callAgent } from "./aiClient.js";
import { getUpcomingEvents } from "./calendarService.js";

// Builds the full context every agent needs, including live calendar events so
// the Scheduling Agent never double-books the user.
export async function buildContext(userId) {
  const [user, tasks, goals] = await Promise.all([
    User.findById(userId),
    Task.find({ user: userId, status: { $ne: "done" } }).sort({ deadline: 1 }),
    Goal.find({ user: userId, status: "active" })
  ]);

  const calendar = await getUpcomingEvents(user);

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
    })),
    calendar
  };
}

// Runs the entire multi-agent workflow and persists the results. This is the
// heart of the AI Autopilot: it is invoked automatically after any meaningful
// change (login, goal/task create/update/delete) so users see fresh guidance
// without ever asking. Failures are swallowed so they never block the user's
// actual write operation.
export async function runAutopilot(userId) {
  try {
    const context = await buildContext(userId);
    const result = await callAgent("/agents/autopilot", context);

    // Persist explainable risk + success fields back onto the tasks.
    await Promise.all(
      (result.risks || []).map((r) =>
        Task.findOneAndUpdate(
          { _id: r.taskId, user: userId },
          {
            riskScore: r.score ?? 0,
            successProbability: r.successProbability ?? null,
            confidence: r.confidence ?? null,
            riskLevel: r.riskLevel ?? null,
            riskReason: r.reason || ""
          }
        ).catch(() => null)
      )
    );

    // Persist the schedule with its per-block explanation.
    await Promise.all(
      (result.schedule || []).map((b) =>
        Task.findOneAndUpdate(
          { _id: b.taskId, user: userId },
          { scheduledStart: b.start, scheduledEnd: b.end }
        ).catch(() => null)
      )
    );

    const state = await AutopilotState.findOneAndUpdate(
      { user: userId },
      {
        user: userId,
        timeline: result.timeline || [],
        todaysFocus: result.todaysFocus || [],
        risks: result.risks || [],
        recommendations: result.recommendations || [],
        procrastinationSignals: result.procrastinationSignals || [],
        schedule: result.schedule || [],
        summary: result.summary || "",
        focusTip: result.focusTip || "",
        lastRunAt: new Date()
      },
      { upsert: true, new: true }
    );
    return state;
  } catch (err) {
    console.error("Autopilot run failed", err.message);
    return null;
  }
}
