import { useEffect, useState } from "react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Spinner } from "../components/ui/Spinner";
import { getTasks } from "../api/tasks";
import { dailyPlan } from "../api/ai";
import { useAuth } from "../context/AuthContext";
import { formatDate, daysUntil, riskLabel } from "../lib/format";
import type { Task } from "../types";

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [plan, setPlan] = useState<any>(null);
  const [loadingPlan, setLoadingPlan] = useState(false);

  useEffect(() => {
    getTasks().then(setTasks).catch(() => {});
  }, []);

  const open = tasks.filter((t) => t.status !== "done");
  const dueSoon = open.filter((t) => {
    const d = daysUntil(t.deadline);
    return d !== null && d <= 3;
  });
  const atRisk = open.filter((t) => t.riskScore >= 0.33);

  async function generatePlan() {
    setLoadingPlan(true);
    try {
      const res = await dailyPlan();
      setPlan(res.plan);
    } finally {
      setLoadingPlan(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Good to see you, {user?.name?.split(" ")[0]}</h2>
        <p className="text-sm text-slate-500">Here is where things stand today.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-slate-500">Open tasks</p>
          <p className="mt-1 text-3xl font-bold">{open.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Due in 3 days</p>
          <p className="mt-1 text-3xl font-bold text-amber-600">{dueSoon.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">At risk</p>
          <p className="mt-1 text-3xl font-bold text-red-600">{atRisk.length}</p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold">Today's AI plan</h3>
            <Button onClick={generatePlan} disabled={loadingPlan}>
              {loadingPlan ? "Thinking..." : "Generate plan"}
            </Button>
          </div>
          {loadingPlan && <Spinner label="Your assistant is planning your day" />}
          {!loadingPlan && !plan && (
            <p className="text-sm text-slate-500">
              Ask your assistant to build a focused plan for today.
            </p>
          )}
          {plan && (
            <div className="space-y-3">
              <p className="text-sm text-slate-600">{plan.summary}</p>
              <ul className="space-y-2">
                {plan.items?.map((item: any, i: number) => (
                  <li key={i} className="rounded-xl bg-slate-50 p-3">
                    <div className="flex justify-between">
                      <span className="font-medium">{item.title}</span>
                      <span className="text-xs text-brand-600">{item.timeBlock}</span>
                    </div>
                    <p className="text-xs text-slate-500">{item.why}</p>
                  </li>
                ))}
              </ul>
              {plan.focusTip && (
                <p className="rounded-xl bg-brand-50 p-3 text-sm text-brand-700">
                  Tip: {plan.focusTip}
                </p>
              )}
            </div>
          )}
        </Card>

        <Card>
          <h3 className="mb-3 font-semibold">Upcoming deadlines</h3>
          {dueSoon.length === 0 ? (
            <p className="text-sm text-slate-500">Nothing urgent. Nice.</p>
          ) : (
            <ul className="space-y-2">
              {dueSoon.map((t) => {
                const r = riskLabel(t.riskScore);
                return (
                  <li key={t._id} className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                    <div>
                      <p className="font-medium">{t.title}</p>
                      <p className="text-xs text-slate-500">Due {formatDate(t.deadline)}</p>
                    </div>
                    <span className={`text-xs font-medium ${r.color}`}>{r.label}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
