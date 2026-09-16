import type { NextFunction, Request, Response } from "express";
import type { ResponseDTO } from "../types/ResponseDTO.js";
import { env } from "../util/envLoader.js";
import jwt from "jsonwebtoken";

import type { JWTPayload } from "../types/JWTPayload.js";
import type { AuthRequest } from "../types/AuthRequest.js";

export const endpointGate = (
  req: Request,
  res: Response<ResponseDTO<null>>,
  next: NextFunction,
) => {
  if (!env.DEV) {
    return res.status(403).json({
      success: false,
      message: "This endpoint is disabled",
      error: "Unreachable endpoint",
      data: null,
    });
  }

  next();
};

export const authGate = (
  req: Request,
  res: Response<ResponseDTO<null>>,
  next: NextFunction,
) => {
  const token = req.cookies?.access_token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
      error: "Unauthorized",
      data: null,
    });
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JWTPayload;
    (req as AuthRequest).user = payload;
    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      error: "Unauthorized",
      data: null,
    });
  }
};
