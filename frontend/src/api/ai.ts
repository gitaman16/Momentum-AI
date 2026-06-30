import { api } from "./client";
import type { AiInsight } from "../types";

export async function planGoal(goalId: string) {
  const res = await api.post(`/ai/plan/${goalId}`);
  return res.data;
}

export async function scheduleTasks() {
  const res = await api.post("/ai/schedule");
  return res.data;
}

export async function analyzeRisk() {
  const res = await api.post("/ai/risk");
  return res.data;
}

export async function dailyPlan() {
  const res = await api.post("/ai/daily-plan");
  return res.data;
}

export async function weeklyReview() {
  const res = await api.post("/ai/weekly-review");
  return res.data;
}

export async function getInsights() {
  const res = await api.get("/ai/insights");
  return res.data.insights as AiInsight[];
}

export async function getAutopilotState() {
  const res = await api.get("/ai/autopilot");
  return res.data.state as import("../types").AutopilotState | null;
}

export async function runAutopilot() {
  const res = await api.post("/ai/autopilot");
  return res.data.state as import("../types").AutopilotState | null;
}

// Natural-language goal creation. Returns the created goal, subtasks and a
// fresh autopilot state in one round-trip.
export async function intakeGoal(text: string) {
  const res = await api.post("/ai/intake", { text });
  return res.data;
}
