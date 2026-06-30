#!/usr/bin/env bash
set -euo pipefail

PROJECT_ID="${PROJECT_ID:-}"
REGION="${REGION:-us-central1}"

if [ -z "$PROJECT_ID" ]; then
  echo "PROJECT_ID is required" >&2
  exit 1
fi

gcloud config set project "$PROJECT_ID"
gcloud services enable run.googleapis.com artifactregistry.googleapis.com

AI_URL=$(gcloud run deploy momentum-ai-ai --source ai-service --region "$REGION" --allow-unauthenticated --set-env-vars "GEMINI_API_KEY=${GEMINI_API_KEY},GEMINI_MODEL=${GEMINI_MODEL:-gemini-2.5-flash}" --format='value(status.url)')
BACKEND_URL=$(gcloud run deploy momentum-ai-backend --source backend --region "$REGION" --allow-unauthenticated --set-env-vars "PORT=4000,MONGODB_URI=${MONGODB_URI},JWT_SECRET=${JWT_SECRET},GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID},GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET},AI_SERVICE_URL=${AI_URL},CLIENT_ORIGIN=${CLIENT_ORIGIN}" --format='value(status.url)')

gcloud run deploy momentum-ai-frontend --source frontend --region "$REGION" --allow-unauthenticated --build-arg "VITE_API_URL=/api" --build-arg "VITE_GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}" --set-env-vars "VITE_API_URL=${BACKEND_URL}/api,VITE_GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}" --format='value(status.url)'

echo "AI_SERVICE_URL=${AI_URL}"
echo "BACKEND_URL=${BACKEND_URL}"
