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

  const configuredOrigins = [process.env.CLIENT_ORIGIN, process.env.CORS_ALLOWED_ORIGINS]
    .flatMap((value) => (value ? value.split(",") : []))
    .map((origin) => origin.trim())
    .filter(Boolean);
  const localOrigins = ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000", "http://127.0.0.1:3000"];
  const githubCodespacesOrigin = /^https?:\/\/[^\s/]+\.app\.github\.dev$/i;
  const githubPreviewOrigin = /^https?:\/\/[^\s/]+\.githubpreview\.dev$/i;

  app.use(cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }
      const normalizedOrigin = origin.replace(/\/$/, "");
      if (process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }
      if (configuredOrigins.includes(normalizedOrigin) || localOrigins.includes(normalizedOrigin)) {
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
  app.get("/readyz", (req, res) => res.json({ status: "ok" }));

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
