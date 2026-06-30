import { FormEvent, useState } from "react";
import { Button } from "./ui/Button";
import { Spinner } from "./ui/Spinner";
import { intakeGoal } from "../api/ai";

// Natural-language goal composer. The user types a sentence; the Intake Agent
// extracts the goal, the backend creates subtasks and runs autopilot.
export function NaturalLanguageGoal({ onDone }: { onDone?: () => void }) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setBusy(true);
    setError("");
    try {
      const res = await intakeGoal(text);
      setResult(res);
      setText("");
      onDone?.();
    } catch (err: any) {
      setError(err.response?.data?.error || "Could not understand that. Try rephrasing.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      <form onSubmit={submit} className="space-y-3">
        <textarea
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
          rows={2}
          placeholder='e.g. "I have an AI assignment due next Friday that should take around 10 hours."'
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button type="submit" disabled={busy}>
          {busy ? "Understanding..." : "Create with AI"}
        </Button>
      </form>
      {busy && <Spinner label="Parsing, planning and scheduling" />}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {result && (
        <div className="rounded-xl border border-brand-200 bg-brand-50 p-3 text-sm text-brand-700">
          <p className="font-medium">Created: {result.goal?.title}</p>
          {result.explanation && <p className="mt-1">{result.explanation}</p>}
          <p className="mt-1">{result.subtasks?.length || 0} subtasks generated and scheduled.</p>
        </div>
      )}
    </div>
  );
}