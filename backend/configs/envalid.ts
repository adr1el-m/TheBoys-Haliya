import dotenv from "dotenv";
import { cleanEnv, num, str } from "envalid";

dotenv.config();

export const env = cleanEnv(process.env, {
  PORT: num({ default: 3000 }),
  DATABASE_URL: str(),
  ACCESS_TOKEN_SECRET: str(),
  REFRESH_TOKEN_SECRET: str(),
});
