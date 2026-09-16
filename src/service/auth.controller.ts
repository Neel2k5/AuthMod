import type { Request, Response } from "express";
import type { ResponseDTO } from "../types/ResponseDTO.js";
import type { AuthRequest } from "../types/AuthRequest.js";
import type { JWTPayload } from "../types/JWTPayload.js";

import type { CreateUserDTO } from "../types/CreateUserDTO.js";
import type { AuthUserDTO } from "../types/AuthUserDTO.js";
import type { FetchUserDTO } from "../types/FetchUserDTO.js";
import type { UpdateUserDTO } from "../types/UpdateUserDTO.js";

import * as authService from "./auth.service.js";

const createUser = async (
  req: Request<{}, {}, CreateUserDTO>,
  res: Response<ResponseDTO<any>>,
) => {
  try {
    const user = await authService.createUser(req.body);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: (err as Error).message,
      error: "CREATE_USER_FAILED",
    });
  }
};

const loginUser = async (
  req: Request<{}, {}, AuthUserDTO>,
  res: Response<ResponseDTO<null>>,
) => {
  try {
    const token = await authService.loginUser(req.body);

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: !process.env.DEV,
      sameSite: "lax",
      maxAge: 5 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "Login successful",
      data: null,
    });
  } catch (err) {
    res.status(401).json({
      success: false,
      message: (err as Error).message,
      error: "LOGIN_FAILED",
    });
  }
};

const fetchUser = async (req: Request, res: Response<ResponseDTO<any>>) => {
  try {
    const query: FetchUserDTO = {
      ...(typeof req.query.email === "string" && { email: req.query.email }),
      ...(typeof req.query.username === "string" && {
        username: req.query.username,
      }),
      ...(typeof req.query.uid === "string" && { uid: req.query.uid }),
      ...(typeof req.query.offset === "string" && {
        offset: Number(req.query.offset),
      }),
    };

    const users = await authService.fetchUser(query);

    res.json({
      success: true,
      message: "User fetched successfully",
      data: users,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: (err as Error).message,
      error: "FETCH_USER_FAILED",
    });
  }
};

const fetchAllUsers = async (req: Request, res: Response<ResponseDTO<any>>) => {
  try {
    const limit =
      typeof req.query.limit === "string" ? Number(req.query.limit) : undefined;

    const offset =
      typeof req.query.offset === "string"
        ? Number(req.query.offset)
        : undefined;

    const users = await authService.fetchAllUsers(limit, offset);

    res.json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: (err as Error).message,
      error: "FETCH_USERS_FAILED",
    });
  }
};

const updateUser = async (
  req: AuthRequest,
  res: Response<ResponseDTO<any>>,
) => {
  try {
    const result = await authService.updateUser(
      req.params.uid as string,
      req.body as UpdateUserDTO,
      req.user as JWTPayload,
    );

    res.json({
      success: true,
      message: "User updated successfully",
      data: result,
    });
  } catch (err) {
    res.status(403).json({
      success: false,
      message: (err as Error).message,
      error: "UPDATE_USER_FAILED",
    });
  }
};

const deleteUser = async (
  req: AuthRequest,
  res: Response<ResponseDTO<any>>,
) => {
  try {
    const result = await authService.deleteUser(
      req.params.uid as string,
      req.user as JWTPayload,
    );

    res.json({
      success: true,
      message: "User deleted successfully",
      data: result,
    });
  } catch (err) {
    res.status(403).json({
      success: false,
      message: (err as Error).message,
      error: "DELETE_USER_FAILED",
    });
  }
};

const logoutUser = async (req: Request, res: Response<ResponseDTO<null>>) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: !process.env.DEV,
    sameSite: "lax",
  });

  res.json({
    success: true,
    message: "Logged out successfully",
    data: null,
  });
};

const fetchMe = async (req: AuthRequest, res: Response<ResponseDTO<any>>) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
        data: null,
      });
    }
    const [user] = await authService.fetchUser({
      uid: req.user.uid as string,
    });

    res.json({
      success: true,
      message: "Authenticated user fetched successfully",
      data: user,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: (err as Error).message,
      error: "FETCH_ME_FAILED",
    });
  }
};

export {
  createUser,
  loginUser,
  fetchUser,
  fetchAllUsers,
  updateUser,
  deleteUser,
  logoutUser,
  fetchMe,
};
