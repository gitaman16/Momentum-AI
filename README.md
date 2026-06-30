# Vibe2Ship

An AI-powered productivity companion that proactively plans, prioritizes, schedules, and helps users complete meaningful work before deadlines slip.

Unlike passive reminder apps, Vibe2Ship runs a team of cooperating AI agents that behave like a real executive assistant: they decompose goals, estimate effort, build daily/weekly plans, predict missed deadlines, detect procrastination, and explain their decisions.

## Architecture

Three services in a monorepo:

| Service | Stack | Responsibility |
|---------|-------|----------------|
| `frontend/` | React + TypeScript + Tailwind | Dashboard, task board, analytics, AI feed |
| `backend/` | Express.js + MongoDB Atlas + JWT/Google OAuth | API gateway, auth, persistence, AI proxy |
| `ai-service/` | FastAPI + LangChain + Gemini | Multi-agent productivity brain |

### Multi-agent brain (ai-service)

- **Planning Agent** - decomposes goals into subtasks, estimates effort.
- **Scheduling Agent** - assigns time blocks, dynamically reschedules.
- **Risk Analysis Agent** - predicts missed deadlines, detects procrastination.
- **Productivity Coach Agent** - daily plans, weekly reviews, insights.
- **Supervisor** - routes requests to the right agent(s) and merges results.

## Local development

```bash
docker-compose up --build
```

Or run each service individually (see each service's README).

- frontend: http://localhost:5173
- backend:  http://localhost:4000
- ai-service: http://localhost:8000

## Deployment

Each service ships as a container to Google Cloud Run. MongoDB Atlas is the managed database. Gemini API powers the agents.
