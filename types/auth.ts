import type { JWTPayload } from "jose";

export type UserRole = "admin" | "operator";

export interface User {
  username: string;
  role: UserRole;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface AuthTokenPayload extends JWTPayload {
  username: string;
  role: UserRole;
}