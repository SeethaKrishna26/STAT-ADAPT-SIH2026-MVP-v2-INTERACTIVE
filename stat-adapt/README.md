# STAT-ADAPT
AI-Powered Competency & Learning Platform for Official Statistics

SIH 2026 Problem Statement 26101

## Included MVP
- Responsive React learner/admin dashboard
- Competency assessment and scoring
- Skill-gap analysis
- Personalized learning recommendations
- Upload PDF/TXT learning material
- RAG-style quiz generation endpoint
- FastAPI backend
- SQLite by default (easy demo); PostgreSQL-ready configuration
- JWT-style demo authentication
- Docker Compose deployment

## Run locally

### Backend
```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## AI configuration
The MVP works without an API key using deterministic quiz generation from extracted text.
For LLM generation, set `OPENAI_API_KEY` in `backend/.env` and install the optional package listed in requirements-optional.txt.

## Docker
```bash
docker compose up --build
```
Frontend: http://localhost:5173
Backend API docs: http://localhost:8000/docs

## Deployment
The easiest production path is:
1. Push this folder to GitHub.
2. Deploy `backend` as a Python web service.
3. Deploy `frontend` as a Node/Vite static site.
4. Set `VITE_API_URL` in the frontend deployment to the backend URL.
5. For production, replace SQLite with PostgreSQL and configure CORS/JWT secrets.

See `DEPLOYMENT.md`.
