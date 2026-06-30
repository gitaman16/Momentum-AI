import dotenv from "dotenv";
import { createApp } from "./app.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 4000;

async function start() {
  await connectDB(process.env.MONGODB_URI);
  const app = createApp();
  app.listen(PORT, () => console.log(`Backend listening on :${PORT}`));
}

start().catch((err) => {
  console.error("Failed to start backend", err);
  process.exit(1);
});
