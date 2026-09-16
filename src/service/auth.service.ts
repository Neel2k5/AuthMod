import { eq, or } from "drizzle-orm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import type { StringValue } from "ms";

import { users } from "../models/users.model.js";
import { db } from "../util/db.js";
import { env } from "../util/envLoader.js";
import config from "../util/config.json" with { type: "json" };

import type { CreateUserDTO } from "../types/CreateUserDTO.js";
import type { FetchUserDTO } from "../types/FetchUserDTO.js";
import type { AuthUserDTO } from "../types/AuthUserDTO.js";
import type { UpdateUserDTO } from "../types/UpdateUserDTO.js";
import type { JWTPayload } from "../types/JWTPayload.js";

const createUser = async (userData: CreateUserDTO) => {
  const existing = await db
    .select({ uid: users.uid })
    .from(users)
    .where(
      or(
        eq(users.email, userData.email),
        eq(users.username, userData.username),
      ),
    )
    .limit(1);

  if (existing.length)
    throw new Error("User with that email or username already exists");

  const passwordHash = await bcrypt.hash(userData.password, 12);

  const [user] = await db
    .insert(users)
    .values({
      username: userData.username,
      email: userData.email,
      passwordHash,
    })
    .$returningId();

  return user;
};

const loginUser = async (userData: AuthUserDTO) => {
  const [user] = await db
    .select({
      uid: users.uid,
      passwordHash: users.passwordHash,
      role: users.role,
    })
    .from(users)
    .where(eq(users.email, userData.email))
    .limit(1);

  if (!user) throw new Error("User does not exist");

  const authCheck = await bcrypt.compare(userData.password, user.passwordHash);

  if (!authCheck) throw new Error("Invalid password or email");

  const token = jwt.sign({ uid: user.uid, role: user.role }, env.JWT_SECRET, {
    expiresIn: (config.jwt_expiry_str ?? "5d") as StringValue,
  });

  return token;
};

const fetchUser = async (userData: FetchUserDTO) => {
  const filters = [];

  if (userData.email) filters.push(eq(users.email, userData.email));
  if (userData.username) filters.push(eq(users.username, userData.username));
  if (userData.uid) filters.push(eq(users.uid, userData.uid));

  if (filters.length === 0) return [];

  const data = await db
    .select({
      uid: users.uid,
      email: users.email,
      username: users.username,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(or(...filters))
    .limit(config.db_fetch_limit_user)
    .offset(userData.offset ?? 0);

  return data;
};

const fetchAllUsers = async (limit?: number, offset?: number) => {
  const data = await db
    .select({
      uid: users.uid,
      email: users.email,
      username: users.username,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .limit(
      limit && limit > 0 && limit <= config.db_fetch_limit_user
        ? limit
        : config.db_fetch_limit_user,
    )
    .offset(offset ?? 0);

  return data;
};

const updateUser = async (
  targetUid: string,
  updates: UpdateUserDTO,
  actor: JWTPayload,
) => {
  const [target] = await db
    .select({
      uid: users.uid,
      role: users.role,
    })
    .from(users)
    .where(eq(users.uid, targetUid))
    .limit(1);

  if (!target) throw new Error("Target user not found");

  const isSelf = actor.uid === target.uid;

  if (!isSelf) {
    if (actor.role === "USER") throw new Error("You cannot update other users");

    if (actor.role === "MODERATOR" && target.role === "ADMIN")
      throw new Error("Moderators cannot update admins");
  }

  const data: Record<string, any> = {};

  if (updates.username) data.username = updates.username;
  if (updates.email) data.email = updates.email;
  if (updates.role && actor.role === "ADMIN") data.role = updates.role;

  if (updates.password)
    data.passwordHash = await bcrypt.hash(updates.password, 12);

  if (Object.keys(data).length === 0) throw new Error("Nothing to update");

  await db.update(users).set(data).where(eq(users.uid, targetUid));

  return { uid: targetUid };
};

const deleteUser = async (targetUid: string, actor: JWTPayload) => {
  const [target] = await db
    .select({
      uid: users.uid,
      role: users.role,
    })
    .from(users)
    .where(eq(users.uid, targetUid))
    .limit(1);

  if (!target) throw new Error("User not found");

  const isSelf = actor.uid === target.uid;

  switch (actor.role) {
    case "USER":
      if (!isSelf) throw new Error("You can only delete your own account");
      break;

    case "MODERATOR":
      if (target.role !== "USER")
        throw new Error("Moderators can only delete users");
      break;

    case "ADMIN":
      // Full access
      break;
  }

  await db.delete(users).where(eq(users.uid, targetUid));

  return { uid: targetUid };
};

export {
  deleteUser,
  createUser,
  loginUser,
  fetchUser,
  fetchAllUsers,
  updateUser,
};
