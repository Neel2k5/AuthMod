import { Router, type Request, type Response } from "express";
import type { ResponseDTO } from "../types/ResponseDTO.js";

import { authGate, endpointGate } from "./auth.middleware.js";
import {
  createUser,
  loginUser,
  fetchUser,
  fetchAllUsers,
  deleteUser,
  logoutUser,
  fetchMe,
} from "./auth.controller.js";

const authRouter = Router();
const userRouter = Router();

// User routes
userRouter.post("/new", createUser);
userRouter.post("/login", loginUser);
userRouter.get("/", authGate, fetchUser);
userRouter.get("/all", authGate, fetchAllUsers);
userRouter.delete("/:uid", authGate, deleteUser);
userRouter.post("/logout", authGate, logoutUser);
userRouter.get("/me", authGate, fetchMe);

// Dev route
authRouter.get(
  "/test",
  endpointGate,
  (req: Request, res: Response<ResponseDTO<null>>) => {
    res.json({
      success: true,
      message: "You have hit the test endpoint. API is in dev mode.",
      data: null,
    });
  },
);

authRouter.use("/user", userRouter);

export { authRouter };
