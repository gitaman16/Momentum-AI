import { api } from "./client";
import type { Goal } from "../types";

export async function getGoals() {
  const res = await api.get("/goals");
  return res.data.goals as Goal[];
}

export async function createGoal(payload: Partial<Goal>) {
  const res = await api.post("/goals", payload);
  return res.data.goal as Goal;
}

export async function updateGoal(id: string, payload: Partial<Goal>) {
  const res = await api.patch(`/goals/${id}`, payload);
  return res.data.goal as Goal;
}

export async function deleteGoal(id: string) {
  await api.delete(`/goals/${id}`);
}
