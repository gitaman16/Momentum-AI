import mongoose from "mongoose";

// A task is the atomic unit of work. It may belong to a goal and may be
// scheduled into a time block by the Scheduling Agent.
const taskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    goal: { type: mongoose.Schema.Types.ObjectId, ref: "Goal", default: null },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium"
    },
    status: {
      type: String,
      enum: ["todo", "in_progress", "done"],
      default: "todo"
    },
    estimatedMinutes: { type: Number, default: 30 },
    actualMinutes: { type: Number, default: 0 },
    deadline: { type: Date, default: null },
    scheduledStart: { type: Date, default: null },
    scheduledEnd: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    // Set by the Risk Analysis Agent on its latest run.
    riskScore: { type: Number, default: 0 },
    aiGenerated: { type: Boolean, default: false }
  },
  { timestamps: true }
);

taskSchema.index({ user: 1, status: 1, deadline: 1 });

export const Task = mongoose.model("Task", taskSchema);
