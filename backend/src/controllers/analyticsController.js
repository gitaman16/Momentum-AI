import { Task } from "../models/Task.js";

// Computes productivity metrics directly from task data. Pure aggregation, no
// AI call, so the analytics page loads instantly.
export async function getAnalytics(req, res) {
  const tasks = await Task.find({ user: req.user.id });
  const now = Date.now();

  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "done");
  const completionRate = total ? Math.round((done.length / total) * 100) : 0;

  // Overdue: not done and past deadline.
  const overdue = tasks.filter(
    (t) => t.status !== "done" && t.deadline && new Date(t.deadline).getTime() < now
  );
  const openWithDeadline = tasks.filter((t) => t.status !== "done" && t.deadline);
  const overdueRate = openWithDeadline.length
    ? Math.round((overdue.length / openWithDeadline.length) * 100)
    : 0;

  // Estimation accuracy + average delay from completed tasks with logged time.
  const logged = done.filter((t) => t.actualMinutes > 0);
  const estTotal = logged.reduce((s, t) => s + t.estimatedMinutes, 0);
  const actTotal = logged.reduce((s, t) => s + t.actualMinutes, 0);
  const estimationAccuracy = actTotal ? Math.round((estTotal / actTotal) * 100) : null;
  const avgDelayMinutes = logged.length
    ? Math.round(logged.reduce((s, t) => s + (t.actualMinutes - t.estimatedMinutes), 0) / logged.length)
    : 0;

  // Busiest weekdays + most productive hours from completion timestamps.
  const weekdayCounts = Array(7).fill(0);
  const hourCounts = Array(24).fill(0);
  for (const t of done) {
    if (!t.completedAt) continue;
    const d = new Date(t.completedAt);
    weekdayCounts[d.getDay()]++;
    hourCounts[d.getHours()]++;
  }
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const busiestWeekday = weekdays[weekdayCounts.indexOf(Math.max(...weekdayCounts))];
  const mostProductiveHour = hourCounts.indexOf(Math.max(...hourCounts));

  // 7-day productivity trend: completed tasks per day.
  const trend = [];
  for (let i = 6; i >= 0; i--) {
    const day = new Date(now - i * 24 * 60 * 60 * 1000);
    const label = weekdays[day.getDay()];
    const count = done.filter((t) => {
      if (!t.completedAt) return false;
      const c = new Date(t.completedAt);
      return c.toDateString() === day.toDateString();
    }).length;
    trend.push({ day: label, completed: count });
  }

  // Weekly score blends completion, on-time delivery and estimation accuracy.
  const onTime = 100 - overdueRate;
  const accComponent = estimationAccuracy === null ? 100 : Math.min(estimationAccuracy, 100);
  const weeklyScore = Math.round(0.5 * completionRate + 0.3 * onTime + 0.2 * accComponent);

  res.json({
    completionRate,
    overdueRate,
    estimationAccuracy,
    avgDelayMinutes,
    busiestWeekday,
    mostProductiveHour,
    weeklyScore,
    trend,
    weekdayCounts: weekdays.map((d, i) => ({ day: d, count: weekdayCounts[i] }))
  });
}
