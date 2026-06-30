export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  preferences?: Record<string, unknown>;
  onboarded?: boolean;
  calendarConnected?: boolean;
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
  successProbability: number | null;
  confidence: number | null;
  riskLevel: "low" | "medium" | "high" | null;
  riskReason: string;
  aiGenerated: boolean;
}

export interface TimelineEntry {
  timestamp: string;
  agent: string;
  action: string;
  explanation: string;
  result?: Record<string, any>;
}

export interface FocusItem {
  taskId?: string;
  title: string;
  timeBlock: string;
  why: string;
}

export interface RiskEntry {
  taskId: string;
  score: number;
  reason: string;
  successProbability: number;
  confidence: number;
  riskLevel: "low" | "medium" | "high";
}

export interface Recommendation {
  title: string;
  confidence: number;
  reasons: string[];
}

export interface AutopilotState {
  timeline: TimelineEntry[];
  todaysFocus: FocusItem[];
  risks: RiskEntry[];
  recommendations: Recommendation[];
  procrastinationSignals: string[];
  schedule: { taskId: string; start: string; end: string; why?: string }[];
  summary: string;
  focusTip: string;
  lastRunAt: string | null;
}

export interface Analytics {
  completionRate: number;
  overdueRate: number;
  estimationAccuracy: number | null;
  avgDelayMinutes: number;
  busiestWeekday: string;
  mostProductiveHour: number;
  weeklyScore: number;
  trend: { day: string; completed: number }[];
  weekdayCounts: { day: string; count: number }[];
}

export interface AiInsight {
  _id: string;
  type: string;
  summary: string;
  data: Record<string, any>;
  createdAt: string;
}
