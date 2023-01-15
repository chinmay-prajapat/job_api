import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { createCustomError } from "../errors/error_handler";
import * as dotenv from "dotenv";
dotenv.config();
const auth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    throw createCustomError("Authentication invalid", 401);
  }
  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET ?? "") as {
      userId: string;
      name: string;
    };

    if (payload) {
      (req as any).user = {
        userId: payload.userId,
        name: payload?.name
      } as any;

      next();
    }
  } catch (e: any) {
    throw new Error(e);
  }
};
export default auth;
