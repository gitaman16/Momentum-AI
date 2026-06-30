import { FormEvent, useEffect, useState } from "react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Spinner } from "../components/ui/Spinner";
import { getGoals, createGoal, deleteGoal } from "../api/goals";
import { planGoal } from "../api/ai";
import { NaturalLanguageGoal } from "../components/NaturalLanguageGoal";
import { formatDate } from "../lib/format";
import type { Goal } from "../types";

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [planningId, setPlanningId] = useState<string | null>(null);
  const [lastPlan, setLastPlan] = useState<any>(null);

  function load() {
    getGoals().then(setGoals).catch(() => {});
  }
  useEffect(load, []);

  async function add(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    await createGoal({ title, description, deadline: deadline || null });
    setTitle("");
    setDescription("");
    setDeadline("");
    load();
  }

  async function decompose(goal: Goal) {
    setPlanningId(goal._id);
    setLastPlan(null);
    try {
      const res = await planGoal(goal._id);
      setLastPlan({ goal: goal.title, ...res });
    } finally {
      setPlanningId(null);
    }
  }

  async function remove(id: string) {
    await deleteGoal(id);
    load();
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Goals</h2>

      <Card>
        <h3 className="mb-2 font-semibold">Describe a goal in plain language</h3>
        <NaturalLanguageGoal onDone={load} />
      </Card>

      <Card>
        <h3 className="mb-2 font-semibold">Or add one manually</h3>
        <form onSubmit={add} className="space-y-3">
          <input className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="Goal title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="What does success look like?" value={description} onChange={(e) => setDescription(e.target.value)} />
          <div className="flex items-center gap-3">
            <input type="date" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            <Button type="submit">Add goal</Button>
          </div>
        </form>
      </Card>

      {lastPlan && (
        <Card className="border-brand-200 bg-brand-50">
          <h3 className="font-semibold text-brand-700">Plan for: {lastPlan.goal}</h3>
          <p className="mt-1 text-sm text-brand-700">{lastPlan.reasoning}</p>
          <ul className="mt-2 list-disc pl-5 text-sm text-slate-700">
            {lastPlan.subtasks?.map((s: any) => (
              <li key={s._id}>{s.title} ({s.estimatedMinutes}m, {s.priority})</li>
            ))}
          </ul>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {goals.map((g) => (
          <Card key={g._id} className="space-y-2">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold">{g.title}</h3>
              <button onClick={() => remove(g._id)} className="text-xs text-slate-400 hover:text-red-600">x</button>
            </div>
            {g.description && <p className="text-sm text-slate-500">{g.description}</p>}
            <p className="text-xs text-slate-400">Deadline {formatDate(g.deadline)}</p>
            <Button variant="ghost" onClick={() => decompose(g)} disabled={planningId === g._id}>
              {planningId === g._id ? "Planning..." : "AI: break into tasks"}
            </Button>
            {planningId === g._id && <Spinner label="Decomposing goal" />}
          </Card>
        ))}
      </div>
    </div>
  );
}
