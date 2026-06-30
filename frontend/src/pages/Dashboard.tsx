import { useEffect, useState } from "react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Spinner } from "../components/ui/Spinner";
import { TodaysFocus } from "../components/ai/TodaysFocus";
import { AgentTimeline } from "../components/ai/AgentTimeline";
import { WorkloadHeatmap } from "../components/ai/WorkloadHeatmap";
import { RecommendationCard } from "../components/ai/RecommendationCard";
import { SuccessProbability } from "../components/ai/SuccessProbability";
import { RiskBadge } from "../components/ai/RiskBadge";
import { CalendarConnect } from "../components/CalendarConnect";
import { getTasks } from "../api/tasks";
import { getAutopilotState, runAutopilot } from "../api/ai";
import { useAuth } from "../context/AuthContext";
import type { AutopilotState, Task } from "../types";

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [state, setState] = useState<AutopilotState | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // On dashboard load: fetch tasks + the latest autopilot state. If there is no
  // state yet, trigger a fresh run so guidance appears without manual action.
  useEffect(() => {
    getTasks().then(setTasks).catch(() => {});
    getAutopilotState()
      .then((s) => {
        setState(s);
        if (!s) refresh();
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function refresh() {
    setRefreshing(true);
    try {
      const s = await runAutopilot();
      setState(s);
      setTasks(await getTasks());
    } finally {
      setRefreshing(false);
    }
  }

  const open = tasks.filter((t) => t.status !== "done");
  const tracked = open
    .filter((t) => t.successProbability !== null)
    .sort((a, b) => (a.successProbability ?? 100) - (b.successProbability ?? 100))
    .slice(0, 4);

  const capacity = (user?.preferences as any)?.dailyCapacityMinutes || 360;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">
            Good to see you, {user?.name?.split(" ")[0]}
          </h2>
          <p className="text-sm text-slate-500">
            {state?.summary || "Your AI autopilot keeps you ahead of every deadline."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CalendarConnect />
          <Button onClick={refresh} disabled={refreshing}>
            {refreshing ? "Running autopilot..." : "Re-run autopilot"}
          </Button>
        </div>
      </div>

      {refreshing && !state && <Spinner label="Your agents are analyzing your workload" />}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h3 className="mb-3 font-semibold">Today's Focus</h3>
          <TodaysFocus items={state?.todaysFocus || []} tip={state?.focusTip} />
        </Card>

        <Card>
          <h3 className="mb-3 font-semibold">AI activity timeline</h3>
          <AgentTimeline entries={state?.timeline || []} />
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="mb-4 font-semibold">Weekly workload</h3>
          <WorkloadHeatmap tasks={tasks} capacity={capacity} />
        </Card>

        <Card>
          <h3 className="mb-3 font-semibold">Deadline success probability</h3>
          {tracked.length === 0 ? (
            <p className="text-sm text-slate-500">No risk-scored tasks yet.</p>
          ) : (
            <div className="space-y-3">
              {tracked.map((t) => (
                <div key={t._id} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                  <SuccessProbability value={t.successProbability ?? 0} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{t.title}</span>
                      <RiskBadge level={t.riskLevel} />
                    </div>
                    <p className="text-xs text-slate-500">{t.riskReason}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card>
        <h3 className="mb-3 font-semibold">AI recommendations</h3>
        {!state?.recommendations || state.recommendations.length === 0 ? (
          <p className="text-sm text-slate-500">No recommendations right now. You're on track.</p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {state.recommendations.map((r, i) => (
              <RecommendationCard key={i} rec={r} />
            ))}
          </div>
        )}
        {state?.procrastinationSignals && state.procrastinationSignals.length > 0 && (
          <div className="mt-4 rounded-xl bg-amber-50 p-3">
            <p className="text-sm font-medium text-amber-800">Procrastination signals</p>
            <ul className="list-disc pl-5 text-sm text-amber-700">
              {state.procrastinationSignals.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        )}
      </Card>
    </div>
  );
}