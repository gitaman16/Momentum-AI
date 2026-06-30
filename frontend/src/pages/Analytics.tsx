import { useEffect, useState } from "react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import { Card } from "../components/ui/Card";
import { getAnalytics } from "../api/analytics";
import type { Analytics as AnalyticsData } from "../types";

function Metric({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <Card>
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-1 text-3xl font-bold ${accent || ""}`}>{value}</p>
    </Card>
  );
}

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    getAnalytics().then(setData).catch(() => {});
  }, []);

  if (!data) {
    return <p className="text-sm text-slate-500">Loading analytics...</p>;
  }

  const hourLabel = `${data.mostProductiveHour}:00`;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Productivity analytics</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Weekly score" value={`${data.weeklyScore}`} accent="text-brand-600" />
        <Metric label="Completion rate" value={`${data.completionRate}%`} accent="text-emerald-600" />
        <Metric label="Overdue rate" value={`${data.overdueRate}%`} accent="text-red-600" />
        <Metric
          label="Estimation accuracy"
          value={data.estimationAccuracy === null ? "--" : `${data.estimationAccuracy}%`}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Metric label="Avg delay (min)" value={`${data.avgDelayMinutes}`} />
        <Metric label="Busiest weekday" value={data.busiestWeekday} />
        <Metric label="Most productive hour" value={hourLabel} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="mb-4 font-semibold">Productivity trend (7 days)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={data.trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" fontSize={12} />
              <YAxis allowDecimals={false} fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="completed" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="mb-4 font-semibold">Completions by weekday</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data.weekdayCounts}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" fontSize={12} />
              <YAxis allowDecimals={false} fontSize={12} />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}