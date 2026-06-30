export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  preferences?: Record<string, unknown>;
}

export interface Goal {
  _id: string;
  title: string;
  description: string;
  deadline: string | null;
  status: "active" | "completed" | "archived";
}

export interface Task {
  _id: string;
  goal: string | null;
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "todo" | "in_progress" | "done";
  estimatedMinutes: number;
  actualMinutes: number;
  deadline: string | null;
  scheduledStart: string | null;
  scheduledEnd: string | null;
  riskScore: number;
  aiGenerated: boolean;
}

export interface AiInsight {
  _id: string;
  type: string;
  summary: string;
  data: Record<string, any>;
  createdAt: string;
}
