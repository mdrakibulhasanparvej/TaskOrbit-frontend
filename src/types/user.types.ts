import type z from "zod";
import type { userProfileUpdateSchema } from "@/schemas";

/**
 * TaskOrbit roles (new backend) — the ONLY definition of this union (C3).
 * Used by new code; the legacy `Role` union above stays untouched for Class C code.
 */
export type TaskOrbitRole = "ADMIN" | "PROJECT_MANAGER" | "TEAM_MEMBER";

export type Providers = "CREDENTIALS" | "GOOGLE";
export type UserStatus = "ACTIVE" | "BAN";
export type MemberStatus = "NOT_JOINED" | "PENDING" | "APPROVED" | "DECLINED";
export type Gender = "MALE" | "FEMALE" | "KINDER" | "OTHER";

export interface User {
  id: string;
  name: string;
  email: string;
  google_id: string | null;
  profile_url: string | null;
  profile_public_id: string | null;
  /** ADDITIVE (Phase 03): new backend field name for the avatar; legacy name stays `profile_url`. */
  avatar_url?: string | null;
  role: TaskOrbitRole | null;
  provider: Providers;
  user_status: UserStatus;
  member_status: MemberStatus;
  is_active: boolean;
  is_deleted: boolean;
  is_verified: boolean;
  institution_id: number | null;
  created_at: string;
  updated_at: string;
}

type UserProfileBase = Omit<User, "role">;

export type UserProfile = UserProfileBase & {
  role: TaskOrbitRole;
};

export type UserProfileUpdatePayload = z.infer<typeof userProfileUpdateSchema>;

// ─────────────────────────────────────────────────────────────────
// TaskOrbit (new backend) user types — ADDITIVE (Phase 03).
// Consumed by src/api/adapters/user.adapter.ts.
// Shape per plan.md §6.2 (getProfile): full user row — no `student`/`teacher`
// nests, no `profile_url`, no `member_status`, no `institution_id`.
// ─────────────────────────────────────────────────────────────────

/** `data` of GET/PATCH /users/me — the full TaskOrbit user row. */
export interface TaskOrbitUserProfile {
  id: string;
  name: string;
  email: string;
  google_id: string | null;
  provider: Providers;
  avatar_url: string | null;
  avatar_public_id: string | null;
  role: TaskOrbitRole;
  user_status: UserStatus;
  is_active: boolean;
  is_verified: boolean;
  is_deleted: boolean;
  deleted_at: string | null;
  last_login_at: string | null;
  need_password_change: boolean;
  created_at: string;
  updated_at: string;
}

/** Body of PATCH /users/me/password (plan.md §5 U4 — no legacy equivalent). */
export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
}
