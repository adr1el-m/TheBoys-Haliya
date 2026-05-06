# TriagePH

Health intelligence and triage platform with a public patient flow and an admin analytics dashboard.

## Stack
- Next.js + TypeScript + Tailwind (frontend)
- Node + Express + TypeScript + Drizzle ORM (backend)
- PostgreSQL on Neon (DATABASE_URL)
- Groq API for triage classification

## Setup
1. Install dependencies from the repo root:
   npm install
2. Copy environment variables:
   cp .env.example .env
3. Generate or migrate the database (requires a valid DATABASE_URL):
   npm run db:generate
   npm run db:migrate
4. Start the API:
   npm run dev:api
5. Start the web app:
   npm run dev:web
6. Or run both together:
   npm run dev

## Environment Variables
- GROQ_API_KEY: Groq API key
- GROQ_MODEL: Groq model name (defaults to llama-3.3-70b-versatile)
- DATABASE_URL: Neon/PostgreSQL connection string
- WEB_ORIGIN: Allowed web origin(s) for CORS (comma-separated)
- ACCESS_TOKEN_SECRET: JWT access token signing secret
- REFRESH_TOKEN_SECRET: JWT refresh token signing secret
- PORT: API port
