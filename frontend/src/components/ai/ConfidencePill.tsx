// Shows AI confidence consistently wherever a recommendation or score appears.
export function ConfidencePill({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
      <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
      {value}% confidence
    </span>
  );
}