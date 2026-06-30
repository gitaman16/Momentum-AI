# Deploying to Google Cloud Run

This repository is structured for independent deployment of three services: AI service, backend API, and frontend static site. The local Docker Compose setup is for development only; the Cloud Run deployment path is production-oriented and uses environment variables for secrets and runtime configuration.

## Prerequisites

```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
gcloud services enable run.googleapis.com artifactregistry.googleapis.com
```

Make sure these values are available in your shell before deployment:

```bash
export PROJECT_ID=your-project-id
export REGION=us-central1
export GEMINI_API_KEY=your_gemini_key
export GEMINI_MODEL=gemini-2.5-flash
export MONGODB_URI=your_mongodb_atlas_uri
export JWT_SECRET=your_jwt_secret
export GOOGLE_CLIENT_ID=your_google_oauth_client_id
export GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
export CLIENT_ORIGIN=https://your-frontend-url.run.app
```

## 1. AI service

```bash
cd ai-service
gcloud run deploy momentum-ai-ai \
  --source . \
  --region "$REGION" \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY="$GEMINI_API_KEY",GEMINI_MODEL="$GEMINI_MODEL"
```

Record the returned URL and use it as the backend's AI service URL.

## 2. Backend API

```bash
cd backend
gcloud run deploy momentum-ai-backend \
  --source . \
  --region "$REGION" \
  --allow-unauthenticated \
  --set-env-vars PORT=4000,MONGODB_URI="$MONGODB_URI",JWT_SECRET="$JWT_SECRET",GOOGLE_CLIENT_ID="$GOOGLE_CLIENT_ID",GOOGLE_CLIENT_SECRET="$GOOGLE_CLIENT_SECRET",AI_SERVICE_URL=https://YOUR_AI_SERVICE_URL,CLIENT_ORIGIN=https://YOUR_FRONTEND_URL
```

The backend exposes `/health` and `/readyz` for Cloud Run health checks.

## 3. Frontend

```bash
cd frontend
gcloud run deploy momentum-ai-frontend \
  --source . \
  --region "$REGION" \
  --allow-unauthenticated \
  --set-env-vars VITE_API_URL=/api,VITE_GOOGLE_CLIENT_ID="$GOOGLE_CLIENT_ID"
```

The frontend container uses nginx and proxies API calls to the backend service. In production, configure the frontend origin in the backend `CLIENT_ORIGIN` env var and the Google OAuth redirect origins in Google Cloud Console.

## Fast deployment helper

A helper script is available at [cloudrun-deploy.sh](cloudrun-deploy.sh):

```bash
chmod +x cloudrun-deploy.sh
./cloudrun-deploy.sh
```

## Production notes

- No hardcoded localhost URLs remain in the runtime paths.
- All secrets are loaded from environment variables.
- Docker Compose remains local-development-only.
- Google OAuth and Google Calendar require the deployed frontend/backend origins to be registered in the Google OAuth client configuration.
- Health endpoints:
  - AI service: `/health` and `/readyz`
  - Backend: `/health` and `/readyz`
  - Frontend: `/health` and `/readyz`
