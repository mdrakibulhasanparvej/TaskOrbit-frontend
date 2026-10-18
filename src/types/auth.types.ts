import type z from "zod";
import type { loginSchema } from "@/schemas";
import type { ApiResponse } from "./api.types";
import type { Role, TaskOrbitRole, User } from "./user.types";

export type LoginPayload = z.infer<typeof loginSchema>;
export type LoginResponse = ApiResponse<{
  access_token: string;
  refresh_token: string;
  role: Role | null;
}>;

export type RegisterPayload = {
  data: {
    name: string;
    email: string;
    password: string;
  };
  photo: File | null;
};

export interface verifyEmailPayload {
  email: string;
  otp: string;
}

export type VerifyEmailResponse = ApiResponse<{
  access_token: string;
  refresh_token: string;
  user: User;
}>;

// ─────────────────────────────────────────────────────────────────
// TaskOrbit (new backend) adapter-side types — ADDITIVE (Phase 01).
// Consumed by src/api/adapters/auth.adapter.ts (logic lands in Phase 02).
// `TaskOrbitRole` is imported from user.types — single source of truth (C3).
// Shapes per plan.md §6.2 (login / verify-email).
// ─────────────────────────────────────────────────────────────────

/** `data.user` of the TaskOrbit login response. */
export interface TaskOrbitAuthUser {
  id: string;
  name: string;
  email: string;
  role: TaskOrbitRole;
  avatar_url: string | null;
  need_password_change: boolean;
}

/** `data` of POST /auth/login — tokens optional (dev-only in body; cookies are the mechanism). */
export interface TaskOrbitLoginData {
  user: TaskOrbitAuthUser;
  access_token?: string;
  refresh_token?: string;
}

export type TaskOrbitLoginResponse = ApiResponse<TaskOrbitLoginData>;

/** `data` of POST /auth/verify-email — flat shape (replaces the old double-wrap). */
export interface TaskOrbitVerifyEmailData {
  id: string;
  name: string;
  email: string;
  role: TaskOrbitRole;
  avatar_url: string | null;
}
