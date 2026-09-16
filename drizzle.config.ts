/// <reference types="node" />
import { defineConfig } from "drizzle-kit";
import "dotenv/config";
import process from "process";

export default defineConfig({
  dialect: "mysql",
  schema: "./src/models/*",
  out: "./drizzle",
  dbCredentials: {
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
  },
});
