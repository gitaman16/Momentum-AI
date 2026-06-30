import dotenv from "dotenv";
import { createApp } from "./app.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 4000;

async function start() {
  const requiredEnv = ["MONGODB_URI", "JWT_SECRET", "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "AI_SERVICE_URL"];
  const missing = requiredEnv.filter((name) => !process.env[name]);

  if (missing.length) {
    console.error(`Missing required environment variables: ${missing.join(", ")}`);
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
  }

  await connectDB(process.env.MONGODB_URI);
  const app = createApp();
  app.listen(PORT, () => console.log(`Backend listening on :${PORT}`));
}

start().catch((err) => {
  console.error("Failed to start backend", err);
  process.exit(1);
});
