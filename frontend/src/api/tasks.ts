import { api } from "./client";
import type { Task } from "../types";

export async function getTasks(params?: { status?: string; goal?: string }) {
  const res = await api.get("/tasks", { params });
  return res.data.tasks as Task[];
}

export async function createTask(payload: Partial<Task>) {
  const res = await api.post("/tasks", payload);
  return res.data.task as Task;
}

export async function updateTask(id: string, payload: Partial<Task>) {
  const res = await api.patch(`/tasks/${id}`, payload);
  return res.data.task as Task;
}

export async function deleteTask(id: string) {
  await api.delete(`/tasks/${id}`);
}
