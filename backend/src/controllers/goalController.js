import { Goal } from "../models/Goal.js";
import { Task } from "../models/Task.js";

export async function listGoals(req, res) {
  const goals = await Goal.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json({ goals });
}

export async function createGoal(req, res) {
  const { title, description, deadline } = req.body;
  if (!title) {
    return res.status(400).json({ error: "title is required" });
  }
  const goal = await Goal.create({
    user: req.user.id,
    title,
    description,
    deadline: deadline || null
  });
  res.status(201).json({ goal });
}

export async function updateGoal(req, res) {
  const goal = await Goal.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    req.body,
    { new: true }
  );
  if (!goal) return res.status(404).json({ error: "Goal not found" });
  res.json({ goal });
}

export async function deleteGoal(req, res) {
  const goal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  if (!goal) return res.status(404).json({ error: "Goal not found" });
  // Detach tasks from the deleted goal rather than removing user work.
  await Task.updateMany({ goal: goal._id }, { goal: null });
  res.json({ ok: true });
}
