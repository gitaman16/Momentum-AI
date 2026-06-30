# Backend (Express API gateway)

## Run locally

```bash
cp .env.example .env   # fill in values
npm install
npm run dev
```

Server starts on `http://localhost:4000`.

## Endpoints

- `POST /api/auth/register | login | google` - auth
- `GET  /api/auth/me` - current user
- `GET/POST/PATCH/DELETE /api/goals` - goal CRUD
- `GET/POST/PATCH/DELETE /api/tasks` - task CRUD
- `POST /api/ai/plan/:goalId` - Planning Agent
- `POST /api/ai/schedule` - Scheduling Agent
- `POST /api/ai/risk` - Risk Analysis Agent
- `POST /api/ai/daily-plan` - Productivity Coach (daily)
- `POST /api/ai/weekly-review` - Productivity Coach (weekly)
- `GET  /api/ai/insights` - stored AI insights

All `/api/goals`, `/api/tasks`, `/api/ai` routes require a Bearer JWT.
