import dotenv from "dotenv";
import { cleanEnv, num, str } from "envalid";
import path from "path";

const envFile = process.env.ENV_FILE ?? path.join(process.cwd(), "../.env");
dotenv.config({ path: envFile });

export const env = cleanEnv(process.env, {
  PORT: num({ default: 3000 }),
  DATABASE_URL: str(),
  ACCESS_TOKEN_SECRET: str(),
  REFRESH_TOKEN_SECRET: str(),
  GROQ_API_KEY: str(),
  GROQ_MODEL: str({ default: "llama-3.3-70b-versatile" }),
  WEB_ORIGIN: str({ default: "http://localhost:5173,http://localhost:3000" }),
});
