import type { Recommendation } from "../../types";
import { ConfidencePill } from "./ConfidencePill";

// A single explainable AI recommendation: action + confidence + reasons.
export function RecommendationCard({ rec }: { rec: Recommendation }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="font-medium text-slate-800">{rec.title}</p>
        <ConfidencePill value={rec.confidence} />
      </div>
      {rec.reasons?.length > 0 && (
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-500">
          {rec.reasons.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      )}
    </div>
  );
}