import mongoose from "mongoose";

// Persists the latest full autopilot run for a user so the dashboard can
// render Today's Focus, risk, recommendations and the agent timeline
// instantly on load, without re-calling the AI every navigation.
const autopilotStateSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    timeline: { type: Array, default: [] },
    todaysFocus: { type: Array, default: [] },
    risks: { type: Array, default: [] },
    recommendations: { type: Array, default: [] },
    procrastinationSignals: { type: Array, default: [] },
    schedule: { type: Array, default: [] },
    summary: { type: String, default: "" },
    focusTip: { type: String, default: "" },
    lastRunAt: { type: Date, default: null }
  },
  { timestamps: true }
);

export const AutopilotState = mongoose.model("AutopilotState", autopilotStateSchema);
