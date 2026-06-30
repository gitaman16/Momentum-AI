import { api } from "./client";

export async function getCalendarStatus() {
  const res = await api.get("/calendar/status");
  return res.data.connected as boolean;
}

export async function connectCalendar(code: string) {
  const res = await api.post("/calendar/connect", { code });
  return res.data;
}

export async function completeOnboarding() {
  const res = await api.post("/auth/onboarding/complete");
  return res.data;
}
