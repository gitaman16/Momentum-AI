import type { FocusItem } from "../../types";

// Renders the intelligently-selected work for today (not a flat task list).
export function TodaysFocus({ items, tip }: { items: FocusItem[]; tip?: string }) {
  if (!items || items.length === 0) {
    return (
      <p className="text-sm text-slate-500">
        Autopilot has not picked today's focus yet. Add a goal or task to begin.
      </p>
    );
  }
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="flex gap-3 rounded-xl bg-slate-50 p-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
            {i + 1}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="font-medium">{item.title}</span>
              <span className="text-xs font-medium text-brand-600">{item.timeBlock}</span>
            </div>
            <p className="text-xs text-slate-500">{item.why}</p>
          </div>
        </div>
      ))}
      {tip && (
        <p className="rounded-xl bg-brand-50 p-3 text-sm text-brand-700">Focus tip: {tip}</p>
      )}
    </div>
  );
}