import { useMemo } from "react";
import type { Task } from "../../types";

// Weekly workload heatmap built from scheduled tasks (falls back to deadlines).
// Intensity = total estimated minutes assigned to each day of the next 7 days.
const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function shade(minutes: number, capacity: number) {
  if (minutes === 0) return "bg-slate-100 text-slate-400";
  const ratio = minutes / capacity;
  if (ratio < 0.4) return "bg-emerald-200 text-emerald-800";
  if (ratio < 0.75) return "bg-amber-200 text-amber-800";
  if (ratio <= 1) return "bg-orange-300 text-orange-900";
  return "bg-red-400 text-white"; // overloaded
}

export function WorkloadHeatmap({ tasks, capacity = 360 }: { tasks: Task[]; capacity?: number }) {
  const days = useMemo(() => {
    const buckets = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() + i);
      return { date: d, minutes: 0 };
    });
    for (const t of tasks) {
      if (t.status === "done") continue;
      const ref = t.scheduledStart || t.deadline;
      if (!ref) continue;
      const day = new Date(ref);
      day.setHours(0, 0, 0, 0);
      const bucket = buckets.find((b) => b.date.getTime() === day.getTime());
      if (bucket) bucket.minutes += t.estimatedMinutes || 0;
    }
    return buckets;
  }, [tasks]);

  return (
    <div>
      <div className="grid grid-cols-7 gap-2">
        {days.map((b, i) => (
          <div key={i} className="text-center">
            <div className="mb-1 text-xs text-slate-400">{DAY_LABELS[b.date.getDay()]}</div>
            <div
              className={`flex h-16 flex-col items-center justify-center rounded-xl text-xs font-semibold ${shade(
                b.minutes,
                capacity
              )}`}
              title={`${b.minutes} min planned`}
            >
              <span>{Math.round(b.minutes / 60 * 10) / 10}h</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-3 text-xs text-slate-400">
        <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-emerald-200" /> Light</span>
        <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-amber-200" /> Moderate</span>
        <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-red-400" /> Overloaded</span>
      </div>
    </div>
  );
}