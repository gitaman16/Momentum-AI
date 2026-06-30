import { useEffect, useState } from "react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Spinner } from "../components/ui/Spinner";
import { analyzeRisk, weeklyReview, getInsights } from "../api/ai";
import type { AiInsight } from "../types";

export default function Assistant() {
  const [insights, setInsights] = useState<AiInsight[]>([]);
  const [risk, setRisk] = useState<any>(null);
  const [review, setReview] = useState<any>(null);
  const [busy, setBusy] = useState<string | null>(null);

  function loadInsights() {
    getInsights().then(setInsights).catch(() => {});
  }
  useEffect(loadInsights, []);

  async function runRisk() {
    setBusy("risk");
    try {
      const res = await analyzeRisk();
      setRisk(res.report);
      loadInsights();
    } finally {
      setBusy(null);
    }
  }

  async function runReview() {
    setBusy("review");
    try {
      const res = await weeklyReview();
      setReview(res.review);
      loadInsights();
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Your assistant</h2>
        <p className="text-sm text-slate-500">Proactive analysis, risk detection and coaching.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button onClick={runRisk} disabled={busy !== null}>
          {busy === "risk" ? "Analyzing..." : "Analyze deadline risk"}
        </Button>
        <Button onClick={runReview} disabled={busy !== null}>
          {busy === "review" ? "Reviewing..." : "Generate weekly review"}
        </Button>
      </div>

      {busy && <Spinner label="Your assistant is working" />}

      {risk && (
        <Card className="space-y-2">
          <h3 className="font-semibold">Risk report</h3>
          <p className="text-sm text-slate-600">{risk.summary}</p>
          {risk.procrastinationSignals?.length > 0 && (
            <div>
              <p className="text-sm font-medium">Procrastination signals</p>
              <ul className="list-disc pl-5 text-sm text-slate-600">
                {risk.procrastinationSignals.map((s: string, i: number) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          )}
        </Card>
      )}

      {review && (
        <Card className="space-y-3">
          <h3 className="font-semibold">Weekly review</h3>
          <p className="text-sm text-slate-600">{review.summary}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Section title="Wins" items={review.wins} />
            <Section title="Misses" items={review.misses} />
            <Section title="Insights" items={review.insights} />
            <Section title="Next week focus" items={review.nextWeekFocus} />
          </div>
        </Card>
      )}

      <Card>
        <h3 className="mb-3 font-semibold">History</h3>
        {insights.length === 0 ? (
          <p className="text-sm text-slate-500">No insights yet. Run an analysis above.</p>
        ) : (
          <ul className="space-y-2">
            {insights.map((i) => (
              <li key={i._id} className="rounded-xl bg-slate-50 p-3">
                <div className="flex justify-between">
                  <span className="text-xs font-medium uppercase text-brand-600">{i.type.replace("_", " ")}</span>
                  <span className="text-xs text-slate-400">{new Date(i.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-sm text-slate-600">{i.summary}</p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function Section({ title, items }: { title: string; items?: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-sm font-medium">{title}</p>
      <ul className="list-disc pl-5 text-sm text-slate-600">
        {items.map((it, i) => <li key={i}>{it}</li>)}
      </ul>
    </div>
  );
}
