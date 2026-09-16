import type { Request } from "express";

export type AuthRequest = Request & {
  user?: {
    uid: string;
    role: "ADMIN" | "USER" | "MODERATOR";
  };
};
