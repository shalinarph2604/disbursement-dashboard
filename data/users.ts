import { UserRole } from "../types/auth";

export const USERS = [
  {
    username: "admin",
    password: "admin123",
    role: "admin" as UserRole,
  },
  {
    username: "operator",
    password: "operator123",
    role: "operator" as UserRole,
  },
];