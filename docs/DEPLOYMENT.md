# Deployment Guide

This repository is set up for a clean two-project deployment:

- `frontend/` on Vercel as the Next.js app
- `backend/` on Vercel as the API project

## 1. Frontend Project

Create a Vercel project with:

- Root Directory: `frontend`
- Framework Preset: `Next.js`

Set this environment variable:

```env
NEXT_PUBLIC_API_URL=https://your-backend-project.vercel.app/api
```

## 2. Backend Project

Create a second Vercel project with:

- Root Directory: `backend`
- Framework Preset: `Other`

The backend is Vercel-ready because it now has:

- `app.ts` for the shared Express app
- `index.ts` for local hosting
- `api/index.ts` for the Vercel serverless handler
- `vercel.json` routing all requests into the Express app

Set these backend environment variables:

```env
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=verify-full
WEB_ORIGIN=https://your-frontend-project.vercel.app
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
PORT=3000
```

If you need multiple frontend origins:

```env
WEB_ORIGIN=https://your-frontend-project.vercel.app,https://www.your-domain.com
```

## 3. Database

Use Neon or any PostgreSQL provider.

Before production deploys, run:

```bash
npm install
npm run db:migrate
```

## 4. Smoke Tests

After deployment, verify:

1. Frontend loads.
2. Backend root responds.
3. `https://your-backend-project.vercel.app/health` returns `{"status":"ok"}`.
4. A triage request succeeds from the frontend.
5. CORS allows the frontend origin.

## 5. Local Build Checks

Run these before shipping:

```bash
npm run build:api
npm run build:web
npm run lint
```

## 6. Notes

- Frontend defaults to `http://localhost:3000/api` in development.
- Frontend falls back to `/api` in production if `NEXT_PUBLIC_API_URL` is not set.
- For a separate frontend/backend deployment, always set `NEXT_PUBLIC_API_URL`.
