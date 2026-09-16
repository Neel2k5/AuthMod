import {
  mysqlTable,
  varchar,
  mysqlEnum,
  timestamp,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const users = mysqlTable("users", {
  uid: varchar("uid", { length: 36 })
    .primaryKey()
    .default(sql`(UUID())`),

  username: varchar("username", { length: 32 }).notNull().unique(),

  email: varchar("email", { length: 255 }).notNull().unique(),

  passwordHash: varchar("password_hash", { length: 255 }).notNull(),

  role: mysqlEnum("role", ["ADMIN", "USER", "MODERATOR"])
    .notNull()
    .default("USER"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});
