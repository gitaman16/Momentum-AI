import { FormEvent, useEffect, useState } from "react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { getTasks, createTask, updateTask, deleteTask } from "../api/tasks";
import { scheduleTasks } from "../api/ai";
import { addTaskToCalendar } from "../api/calendar";
import { formatDate, priorityColor, riskLabel } from "../lib/format";
import type { Task } from "../types";

const columns: { key: Task["status"]; label: string }[] = [
  { key: "todo", label: "To do" },
  { key: "in_progress", label: "In progress" },
  { key: "done", label: "Done" }
];

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("medium");
  const [deadline, setDeadline] = useState("");
  const [scheduling, setScheduling] = useState(false);

  function load() {
    getTasks().then(setTasks).catch(() => {});
  }
  useEffect(load, []);

  async function add(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    await createTask({ title, priority, deadline: deadline || null });
    setTitle("");
    setDeadline("");
    load();
  }

  async function move(task: Task, status: Task["status"]) {
    await updateTask(task._id, { status });
    load();
  }

  async function remove(id: string) {
    await deleteTask(id);
    load();
  }

  async function autoSchedule() {
    setScheduling(true);
    try {
      await scheduleTasks();
      load();
    } finally {
      setScheduling(false);
    }
  }

  // Tracks which task is currently being added to the calendar, and which are done.
  const [addingId, setAddingId] = useState<string | null>(null);
  const [addedIds, setAddedIds] = useState<string[]>([]);

  async function addToCalendar(task: Task) {
    setAddingId(task._id);
    try {
      await addTaskToCalendar(task._id);
      setAddedIds((prev) => [...prev, task._id]);
    } catch (err: any) {
      alert(err.response?.data?.error || "Could not add to calendar");
    } finally {
      setAddingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold">Tasks</h2>
        <Button variant="ghost" onClick={autoSchedule} disabled={scheduling}>
          {scheduling ? "Scheduling..." : "AI auto-schedule"}
        </Button>
      </div>

      <Card>
        <form onSubmit={add} className="flex flex-wrap gap-3">
          <input className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="Add a task..." value={title} onChange={(e) => setTitle(e.target.value)} />
          <select className="rounded-xl border border-slate-300 px-3 py-2 text-sm" value={priority} onChange={(e) => setPriority(e.target.value as Task["priority"])}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
          <input type="date" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          <Button type="submit">Add</Button>
        </form>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        {columns.map((col) => (
          <div key={col.key} className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-500">{col.label}</h3>
            {tasks.filter((t) => t.status === col.key).map((t) => {
              const r = riskLabel(t.riskScore);
              return (
                <Card key={t._id} className="space-y-2">
                  <div className="flex items-start justify-between">
                    <p className="font-medium">{t.title}</p>
                    <button onClick={() => remove(t._id)} className="text-xs text-slate-400 hover:text-red-600">x</button>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className={`rounded-full px-2 py-0.5 ${priorityColor[t.priority]}`}>{t.priority}</span>
                    <span className="text-slate-500">{formatDate(t.deadline)}</span>
                    {t.status !== "done" && <span className={r.color}>{r.label}</span>}
                    {t.aiGenerated && <span className="text-brand-600">AI</span>}
                  </div>
                  <div className="flex gap-2">
                    {col.key !== "todo" && <Button variant="ghost" className="px-2 py-1 text-xs" onClick={() => move(t, "todo")}>To do</Button>}
                    {col.key !== "in_progress" && <Button variant="ghost" className="px-2 py-1 text-xs" onClick={() => move(t, "in_progress")}>Start</Button>}
                    {col.key !== "done" && <Button variant="ghost" className="px-2 py-1 text-xs" onClick={() => move(t, "done")}>Done</Button>}
                  </div>
                  {t.scheduledStart && t.status !== "done" && (
                    addedIds.includes(t._id) ? (
                      <span className="text-xs font-medium text-emerald-600">Added to calendar</span>
                    ) : (
                      <Button
                        variant="ghost"
                        className="px-2 py-1 text-xs"
                        onClick={() => addToCalendar(t)}
                        disabled={addingId === t._id}
                      >
                        {addingId === t._id ? "Adding..." : "Add to Calendar"}
                      </Button>
                    )
                  )}
                </Card>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
