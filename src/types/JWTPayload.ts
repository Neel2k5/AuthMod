export type JWTPayload = {
  uid: string;
  role: "ADMIN" | "USER" | "MODERATOR";
};
