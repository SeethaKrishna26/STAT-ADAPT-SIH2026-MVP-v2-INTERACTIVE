# Deployment Guide

## Option A — Render-style deployment

### Backend
Create a Web Service from the `backend` directory.

Build command:
```bash
pip install -r requirements.txt
```

Start command:
```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

Environment:
- `FRONTEND_URL=https://YOUR-FRONTEND-DOMAIN`
- `JWT_SECRET=change-this-in-production`
- `DATABASE_URL=sqlite:///./statadapt.db`

### Frontend
Create a Static Site from the `frontend` directory.

Build:
```bash
npm install && npm run build
```

Publish directory:
```text
dist
```

Environment:
```text
VITE_API_URL=https://YOUR-BACKEND-DOMAIN
```

## Option B — Docker

```bash
docker compose up --build
```

This is suitable for a demo server/VPS.

## Before SIH demo
- Add a real PostgreSQL database.
- Add a strong JWT secret.
- Restrict CORS to the production frontend.
- Add actual approved iGOT integration through an adapter.
- Add PDF/DOCX/PPTX extraction and a production vector store.
- Add audit logging and HTTPS.
