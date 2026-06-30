const styles: Record<string, string> = {
  low: "bg-emerald-100 text-emerald-700",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-red-100 text-red-700"
};

export function RiskBadge({ level }: { level: "low" | "medium" | "high" | null }) {
  if (!level) return null;
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${styles[level]}`}>
      {level} risk
    </span>
  );
}