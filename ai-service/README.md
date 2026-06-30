# AI service (FastAPI multi-agent brain)

Four cooperating agents over Gemini via LangChain, coordinated by a Supervisor.

## Run locally

```bash
cp .env.example .env   # set GEMINI_API_KEY
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Endpoints

- `POST /agents/plan` - decompose a goal into estimated subtasks
- `POST /agents/schedule` - assign time blocks to open tasks
- `POST /agents/risk` - score deadline risk + procrastination signals
- `POST /agents/daily-plan` - focused plan for today
- `POST /agents/weekly-review` - data-driven weekly review

Every agent returns strict JSON, parsed by `app/agents/base.py`.
