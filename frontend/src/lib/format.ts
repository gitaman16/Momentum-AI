// Small shared formatting helpers used across pages.

export function formatDate(value: string | null): string {
  if (!value) return "No deadline";
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric"
  });
}

export function daysUntil(value: string | null): number | null {
  if (!value) return null;
  const ms = new Date(value).getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export const priorityColor: Record<string, string> = {
  low: "bg-slate-100 text-slate-600",
  medium: "bg-blue-100 text-blue-700",
  high: "bg-amber-100 text-amber-700",
  urgent: "bg-red-100 text-red-700"
};

export function riskLabel(score: number): { label: string; color: string } {
  if (score >= 0.66) return { label: "High risk", color: "text-red-600" };
  if (score >= 0.33) return { label: "At risk", color: "text-amber-600" };
  return { label: "On track", color: "text-emerald-600" };
}
