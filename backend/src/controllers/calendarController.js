import { User } from "../models/User.js";
import { Task } from "../models/Task.js";
import { connectCalendar, getUpcomingEvents, createEvent } from "../services/calendarService.js";
import { runAutopilot } from "../services/autopilotService.js";

// Exchange the auth code from the frontend popup and store calendar tokens,
// then re-run autopilot so scheduling immediately respects calendar events.
export async function connect(req, res) {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: "code is required" });
  await connectCalendar(req.user.id, code);
  runAutopilot(req.user.id).catch(() => {});
  res.json({ ok: true });
}

export async function status(req, res) {
  const user = await User.findById(req.user.id);
  res.json({ connected: !!user?.google?.calendarConnected });
}

export async function events(req, res) {
  const user = await User.findById(req.user.id);
  const items = await getUpcomingEvents(user);
  res.json({ events: items });
}

// Push a single scheduled task's focus block onto the user's calendar.
export async function addTask(req, res) {
  const user = await User.findById(req.user.id);
  if (!user?.google?.calendarConnected) {
    return res.status(400).json({ error: "Connect Google Calendar first" });
  }

  const task = await Task.findOne({ _id: req.params.taskId, user: req.user.id });
  if (!task) return res.status(404).json({ error: "Task not found" });
  if (!task.scheduledStart || !task.scheduledEnd) {
    return res.status(400).json({ error: "Task has no scheduled time. Run autopilot first." });
  }

  const eventId = await createEvent(user, {
    title: `Focus: ${task.title}`,
    start: new Date(task.scheduledStart).toISOString(),
    end: new Date(task.scheduledEnd).toISOString()
  });

  res.json({ ok: true, eventId });
}
