import type { TimelineEntry } from "../../types";

// Visualizes the multi-agent workflow as a vertical timeline. Each step shows
// the agent, its action, a timestamp and the explanation behind the result.
export function AgentTimeline({ entries }: { entries: TimelineEntry[] }) {
  if (!entries || entries.length === 0) {
    return <p className="text-sm text-slate-500">No autopilot activity yet.</p>;
  }
  return (
    <ol className="relative ml-3 border-l border-slate-200">
      {entries.map((e, i) => (
        <li key={i} className="mb-5 ml-5">
          <span className="absolute -left-[7px] mt-1 h-3 w-3 rounded-full border-2 border-white bg-brand-500" />
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-brand-700">{e.agent}</span>
            <span className="text-xs text-slate-400">
              {new Date(e.timestamp).toLocaleTimeString()}
            </span>
          </div>
          <p className="text-sm font-medium text-slate-700">{e.action}</p>
          <p className="text-xs text-slate-500">{e.explanation}</p>
        </li>
      ))}
    </ol>
  );
}