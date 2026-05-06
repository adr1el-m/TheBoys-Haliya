import { type CorsOptions } from "cors";
import { env } from "./envalid.js";

const allowedOrigins = env.WEB_ORIGIN
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const vercelOrigins = [
  process.env.VERCEL_URL,
  process.env.VERCEL_PROJECT_PRODUCTION_URL,
]
  .filter(Boolean)
  .map((host) => `https://${host}`);

export const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || vercelOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
