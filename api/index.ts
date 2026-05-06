import type { Request, Response } from "express";
import app from "../backend/app.js";
import { connectDB } from "../backend/configs/db.js";

let databaseReady: Promise<void> | null = null;
const API_PREFIX = "/api";

const getCatchAllPath = (path: unknown) => {
  const values = Array.isArray(path) ? path : typeof path === "string" ? [path] : [];
  return values
    .flatMap((value) => String(value).split("/"))
    .filter(Boolean)
    .join("/");
};

const normalizeApiRequestUrl = (url = "/", catchAllPath = "") => {
  const queryIndex = url.indexOf("?");
  const pathname = queryIndex === -1 ? url : url.slice(0, queryIndex);
  const search = queryIndex === -1 ? "" : url.slice(queryIndex);

  if ((pathname === "/" || pathname === API_PREFIX) && catchAllPath) {
    return `${API_PREFIX}/${catchAllPath}${search}`;
  }

  if (pathname === "/health" || pathname === API_PREFIX || pathname.startsWith(`${API_PREFIX}/`)) {
    return url;
  }

  const normalizedPathname = pathname === "/" ? API_PREFIX : `${API_PREFIX}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
  return `${normalizedPathname}${search}`;
};

const ensureDatabaseConnection = () => {
  if (!databaseReady) {
    databaseReady = connectDB().catch((error) => {
      databaseReady = null;
      throw error;
    });
  }

  return databaseReady;
};

export default async function handler(req: Request, res: Response) {
  req.url = normalizeApiRequestUrl(req.url, getCatchAllPath(req.query?.path));
  await ensureDatabaseConnection();
  return app(req, res);
}
