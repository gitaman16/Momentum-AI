import { useEffect, useMemo, useState } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import { Card } from "../components/ui/Card";
import { getTasks } from "../api/tasks";
import type { Task } from "../types";

const PIE_COLORS = ["#94a3b8", "#3b82f6", "#f59e0b", "#ef4444"];

export default function Analytics() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    getTasks().then(setTasks).catch(() => {});
  }, []);

  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((t) => t.status === "done").length;
    const completion = total ? Math.round((done / total) * 100) : 0;

    const byPriority = ["low", "medium", "high", "urgent"].map((p) => ({
      name: p,
      value: tasks.filter((t) => t.priority === p).length
    }));

    const byStatus = [
      { name: "To do", count: tasks.filter((t) => t.status === "todo").length },
      { name: "In progress", count: tasks.filter((t) => t.status === "in_progress").length },
      { name: "Done", count: done }
    ];

    // Estimation accuracy from completed tasks that logged actual time.
    const logged = tasks.filter((t) => t.status === "done" && t.actualMinutes > 0);
    const estTotal = logged.reduce((s, t) => s + t.estimatedMinutes, 0);
    const actTotal = logged.reduce((s, t) => s + t.actualMinutes, 0);
    const accuracy = actTotal ? Math.round((estTotal / actTotal) * 100) : null;

    return { completion, byPriority, byStatus, accuracy };
  }, [tasks]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Analytics</h2>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-slate-500">Completion rate</p>
          <p className="mt-1 text-3xl font-bold text-emerald-600">{stats.completion}%</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Total tasks</p>
          <p className="mt-1 text-3xl font-bold">{tasks.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Estimation accuracy</p>
          <p className="mt-1 text-3xl font-bold text-brand-600">
            {stats.accuracy === null ? "--" : `${stats.accuracy}%`}
          </p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="mb-4 font-semibold">Tasks by status</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={stats.byStatus}>
              <XAxis dataKey="name" fontSize={12} />
              <YAxis allowDecimals={false} fontSize={12} />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="mb-4 font-semibold">Priority distribution</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={stats.byPriority} dataKey="value" nameKey="name" outerRadius={90} label>
                {stats.byPriority.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
