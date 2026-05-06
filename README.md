# Haliya

AI-assisted health triage and public health intelligence for the Philippines.

## Active Structure

```text
codekada/
├── backend/          # Express + Drizzle API
│   ├── api/          # Vercel serverless entrypoint
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
└── package.json      # Workspace scripts
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

Frontend uses `frontend/.env.local`.

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

In production, set `NEXT_PUBLIC_API_URL` to your deployed backend URL if frontend and backend are deployed as separate projects.

## Deployment

This repo is ready for a two-project Vercel setup:

1. Deploy `frontend/` as a Vercel Next.js project.
2. Deploy `backend/` as a separate Vercel project.
3. Set `NEXT_PUBLIC_API_URL` on the frontend to the backend deployment URL plus `/api`.
4. Set `WEB_ORIGIN` on the backend to the frontend production origin.

The backend now includes:

- `backend/app.ts` for the shared Express app
- `backend/index.ts` for local/serverful hosting
- `backend/api/index.ts` for Vercel serverless deployment
- `backend/vercel.json` to route all requests through the API handler

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
