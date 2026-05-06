# Haliya

AI-assisted health triage and public health intelligence for the Philippines.

## Active Structure

```text
codekada/
├── api/              # Vercel serverless entrypoint for /api/*
├── backend/          # Express + Drizzle API
│   ├── api/          # Optional backend-only serverless entrypoint
│   ├── configs/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── app.ts        # Shared Express app
│   └── index.ts      # Local Node server entrypoint
├── frontend/         # Next.js app
│   ├── public/
│   ├── src/
│   ├── .env.example
│   └── next.config.ts
├── packages/
│   └── db/
├── docs/
│   ├── DEPLOYMENT.md
│   ├── FEATURES.md
│   ├── PITCH.md
│   └── WINNING_CHECKLIST.md
├── .env.example      # Backend environment template
├── vercel.json       # Single-project Vercel deployment config
└── package.json      # Workspace scripts and Vercel framework deps
```

Legacy prototypes, broken one-off migration scripts, local editor files, and token dumps were removed so the repo only contains the active product and supporting docs.

## Local Development

```bash
npm install
cp .env.example .env
cp frontend/.env.example frontend/.env.local
npm run dev
```

Local URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`
- Health check: `http://localhost:3000/health`

## Workspace Scripts

```bash
npm run dev
npm run build
npm run build:api
npm run build:web
npm run lint
npm run clean
```

## Environment

Backend uses the root `.env`.

Required backend variables:

```env
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=verify-full
WEB_ORIGIN=http://localhost:5173,https://your-frontend-domain.vercel.app
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
PORT=3000
```

Frontend can use `frontend/.env.local` during local-only development.

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

In production, leave `NEXT_PUBLIC_API_URL` unset. The app uses same-origin `/api`.

## Deployment

This repo is ready for one Vercel project:

1. Import the repo once.
2. Leave Root Directory blank so Vercel uses the repository root.
3. Keep Framework Preset as `Next.js`.
4. Add the root `.env.example` values in that one Vercel project.

Root `vercel.json` builds the Next app from `frontend/` and serves the Express backend through `/api/*` functions.

Detailed deployment steps live in [docs/DEPLOYMENT.md](/Users/adrielmagalona/Desktop/codekada/docs/DEPLOYMENT.md:1).

## Verification

Current repo verification commands:

```bash
npm run build:api
npm run build:web
npm run lint
```

## Docs

- [Deployment Guide](/Users/adrielmagalona/Desktop/codekada/docs/DEPLOYMENT.md:1)
- [Feature Overview](/Users/adrielmagalona/Desktop/codekada/docs/FEATURES.md:1)
- [Pitch Deck Notes](/Users/adrielmagalona/Desktop/codekada/docs/PITCH.md:1)
- [Winning Checklist](/Users/adrielmagalona/Desktop/codekada/docs/WINNING_CHECKLIST.md:1)
