import mongoose from "mongoose";

// A goal is a high-level objective the Planning Agent decomposes into tasks.
const goalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    deadline: { type: Date, default: null },
    status: {
      type: String,
      enum: ["active", "completed", "archived"],
      default: "active"
    }
  },
  { timestamps: true }
);

export const Goal = mongoose.model("Goal", goalSchema);
