import dotenv from "dotenv";
dotenv.config();

const requireENV = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Environment Variable ${key} is not found`);
  return value;
};

export const env = {
  PORT: Number(requireENV("PORT")),
  DEV: requireENV("DEV") === "true",

  DB_DRIVER: requireENV("DB_DRIVER"),
  DB_HOST: requireENV("DB_HOST"),
  DB_PORT: Number(requireENV("DB_PORT")),
  DB_USER: requireENV("DB_USER"),
  DB_PASSWORD: requireENV("DB_PASSWORD"),
  DB_NAME: requireENV("DB_NAME"),

  JWT_SECRET: requireENV("JWT_SECRET"),
};
