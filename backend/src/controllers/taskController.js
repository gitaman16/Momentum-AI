import { Task } from "../models/Task.js";

export async function listTasks(req, res) {
  const { status, goal } = req.query;
  const filter = { user: req.user.id };
  if (status) filter.status = status;
  if (goal) filter.goal = goal;

  const tasks = await Task.find(filter).sort({ deadline: 1, priority: -1 });
  res.json({ tasks });
}

export async function createTask(req, res) {
  const { title, description, priority, estimatedMinutes, deadline, goal } = req.body;
  if (!title) {
    return res.status(400).json({ error: "title is required" });
  }
  const task = await Task.create({
    user: req.user.id,
    goal: goal || null,
    title,
    description,
    priority,
    estimatedMinutes,
    deadline: deadline || null
  });
  res.status(201).json({ task });
}

export async function updateTask(req, res) {
  const updates = { ...req.body };
  // Stamp completion time when a task is marked done.
  if (updates.status === "done") {
    updates.completedAt = new Date();
  }
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    updates,
    { new: true }
  );
  if (!task) return res.status(404).json({ error: "Task not found" });
  res.json({ task });
}

export async function deleteTask(req, res) {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  if (!task) return res.status(404).json({ error: "Task not found" });
  res.json({ ok: true });
}
