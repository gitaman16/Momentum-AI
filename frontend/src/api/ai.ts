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
