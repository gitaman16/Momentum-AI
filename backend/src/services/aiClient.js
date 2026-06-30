import axios from "axios";

// Thin client around the FastAPI ai-service. Keeps the AI base URL and timeout
// in one place so controllers stay clean.
const client = axios.create({
  baseURL: process.env.AI_SERVICE_URL || "http://localhost:8000",
  timeout: 60000
});

export async function callAgent(endpoint, payload) {
  const { data } = await client.post(endpoint, payload);
  return data;
}
