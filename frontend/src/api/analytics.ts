import { api } from "./client";
import type { Analytics } from "../types";

export async function getAnalytics() {
  const res = await api.get("/analytics");
  return res.data as Analytics;
}
