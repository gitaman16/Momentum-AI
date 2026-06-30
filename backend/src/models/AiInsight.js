import mongoose from "mongoose";

// Stores structured AI outputs (daily plans, weekly reviews, risk reports,
// coaching notes) so the frontend can render a history without re-calling the AI.
const aiInsightSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: {
      type: String,
      enum: ["daily_plan", "weekly_review", "risk_report", "coaching", "recommendation"],
      required: true
    },
    summary: { type: String, default: "" },
    // Full structured payload returned by the agent.
    data: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

export const AiInsight = mongoose.model("AiInsight", aiInsightSchema);
