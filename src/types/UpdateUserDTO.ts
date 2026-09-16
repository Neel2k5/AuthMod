export type UpdateUserDTO = {
  username?: string;
  email?: string;
  password?: string;
  role?: "ADMIN" | "USER" | "MODERATOR";
};
