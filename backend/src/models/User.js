import mongoose from "mongoose";

// A user can sign up with email/password or Google OAuth.
// preferences hold the data the Scheduling Agent needs to build realistic plans.
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, default: null },
    googleId: { type: String, default: null },
    avatarUrl: { type: String, default: null },
    preferences: {
      workingHours: {
        start: { type: String, default: "09:00" },
        end: { type: String, default: "18:00" }
      },
      timezone: { type: String, default: "UTC" },
      focusBlockMinutes: { type: Number, default: 50 },
      // Max preferred focus minutes per day; used to detect overloaded days.
      dailyCapacityMinutes: { type: Number, default: 360 }
    },
    // Set once the user has completed first-time onboarding.
    onboarded: { type: Boolean, default: false },
    // Google Calendar OAuth tokens (only stored if the user connects calendar).
    google: {
      accessToken: { type: String, default: null },
      refreshToken: { type: String, default: null },
      tokenExpiry: { type: Date, default: null },
      calendarConnected: { type: Boolean, default: false }
    }
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
