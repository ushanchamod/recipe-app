import jwt from "jsonwebtoken";
import config from "../config/config";
import { sendError } from "../utils";
import { NextFunction, Request, Response } from "express";

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const useGuard = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return sendError(res, "No token provided", 401);
  }

  try {
    if (!config.JWT_SECRET) {
      return sendError(res, "JWT secret is not configured", 500);
    }
    const decoded = jwt.verify(token, config.JWT_SECRET as string);
    req.user = decoded;
    next();
  } catch (error) {
    return sendError(res, "Forbidden", 403);
  }
};

export const useGuardOptional = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    req.user = null; // Allow access without a token
    return next();
  }

  try {
    if (!config.JWT_SECRET) {
      return sendError(res, "JWT secret is not configured", 500);
    }
    const decoded = jwt.verify(token, config.JWT_SECRET as string);
    req.user = decoded;
    next();
  } catch (error) {
    req.user = null; // Allow access even if token verification fails
    return next();
  }
};
