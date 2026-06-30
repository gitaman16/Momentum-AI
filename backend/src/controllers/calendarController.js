import { User } from "../models/User.js";
import { connectCalendar, getUpcomingEvents } from "../services/calendarService.js";
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
