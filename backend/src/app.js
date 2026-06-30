import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import calendarRoutes from "./routes/calendarRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

// Builds the Express app. Route modules are mounted here; server.js starts it.
export function createApp() {
  const app = express();

  const clientOrigins = process.env.CLIENT_ORIGIN
    ? process.env.CLIENT_ORIGIN.split(",").map((origin) => origin.trim()).filter(Boolean)
    : [];
  const githubCodespacesOrigin = /^https?:\/\/[^\s/]+\.app\.github\.dev$/i;
  const githubPreviewOrigin = /^https?:\/\/[^\s/]+\.githubpreview\.dev$/i;

  app.use(cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }
      if (process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }
      if (clientOrigins.includes(origin)) {
        return callback(null, true);
      }
      if (githubCodespacesOrigin.test(origin) || githubPreviewOrigin.test(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }));
  app.use(express.json());
  app.use(morgan("dev"));

  app.get("/health", (req, res) => res.json({ status: "ok" }));

  app.use("/api/auth", authRoutes);
  app.use("/api/goals", goalRoutes);
  app.use("/api/tasks", taskRoutes);
  app.use("/api/ai", aiRoutes);
  app.use("/api/analytics", analyticsRoutes);
  app.use("/api/calendar", calendarRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
