import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import type { Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { db } from "../configs/db.js";
import { env } from "../configs/envalid.js";
import { users } from "../models/userModel.js";
import { tryCatch } from "../utils/tryCatch.js";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };

  if (!email || !password) {
    return res.status(400).json({
      message: "Email Address and Password are required",
      isError: true,
    });
  }

  const foundUser = await tryCatch(
    db.select().from(users).where(eq(users.email, email)),
  );

  if (foundUser.error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", isError: true });
  }

  if (!foundUser.data || foundUser.data.length === 0) {
    return res
      .status(401)
      .json({ message: "User account not found", isError: true });
  }

  const user = foundUser.data[0];

  if (!user) {
    return res
      .status(401)
      .json({ message: "User account not found", isError: true });
  }

  const match = await tryCatch(bcrypt.compare(password, user.password_hash));

  if (match.error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", isError: true });
  }

  if (!match.data) {
    return res
      .status(401)
      .json({ message: "Invalid credentials", isError: true });
  }

  const accessToken = jwt.sign({ sub: user.email }, env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ sub: user.email }, env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ accessToken });
};

export const refresh = async (req: Request, res: Response) => {
  const cookies = req.cookies as { jwt?: string };

  if (!cookies?.jwt) {
    return res.status(401).json({ message: "Unauthorized", isError: true });
  }

  const refreshToken = cookies.jwt;

  jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
    if (err || !decoded) {
      return res.status(403).json({ message: "Forbidden", isError: true });
    }

    const payload = decoded as JwtPayload;

    if (!payload.sub) {
      return res.status(403).json({ message: "Forbidden", isError: true });
    }

    const foundUser = await tryCatch(
      db.select().from(users).where(eq(users.email, payload.sub)),
    );

    if (foundUser.error || !foundUser.data || foundUser.data.length === 0) {
      return res.status(401).json({ message: "Unauthorized", isError: true });
    }

    const user = foundUser.data[0];

    if (!user) {
      return res.status(401).json({ message: "Unauthorized", isError: true });
    }

    const accessToken = jwt.sign({ sub: user.email }, env.ACCESS_TOKEN_SECRET, {
      expiresIn: "15m",
    });

    res.json({ accessToken });
  });
};

export const logout = async (req: Request, res: Response) => {
  const cookies = req.cookies as { jwt?: string };

  if (!cookies?.jwt) {
    return res.sendStatus(204);
  }

  res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
  res.json({ message: "Cookie cleared" });
};
