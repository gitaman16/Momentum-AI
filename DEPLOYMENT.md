# Deploying to Google Cloud Run

Each service is an independent container. Deploy them separately.

## Prerequisites

```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
gcloud services enable run.googleapis.com artifactregistry.googleapis.com
```

Use MongoDB Atlas for the database and create a Gemini API key in Google AI Studio.

## 1. AI service

```bash
cd ai-service
gcloud run deploy vibe2ship-ai \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=YOUR_KEY,GEMINI_MODEL=gemini-1.5-flash
```

Note the deployed URL, e.g. `https://vibe2ship-ai-xxxx.run.app`.

## 2. Backend

```bash
cd backend
gcloud run deploy vibe2ship-api \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars MONGODB_URI=YOUR_ATLAS_URI,JWT_SECRET=YOUR_SECRET,GOOGLE_CLIENT_ID=YOUR_OAUTH_ID,AI_SERVICE_URL=https://vibe2ship-ai-xxxx.run.app,CLIENT_ORIGIN=https://vibe2ship-web-xxxx.run.app
```

## 3. Frontend

Build-time env vars are baked into the static bundle, so pass them at build:

```bash
cd frontend
gcloud run deploy vibe2ship-web \
  --source . \
  --region us-central1 \
  --allow-unauthenticated
```

Set `VITE_API_URL` and `VITE_GOOGLE_CLIENT_ID` in a `.env` (or as Docker build args) before building so the SPA points at the deployed backend.

## Order of operations

1. Deploy ai-service, capture URL.
2. Deploy backend with that URL.
3. Deploy frontend with the backend URL.
4. Update backend `CLIENT_ORIGIN` to the frontend URL and redeploy.
