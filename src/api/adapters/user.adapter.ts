/**
 * User response adapters — TaskOrbit DTO → legacy Edu-Matrix contract.
 * Pure functions only (plan.md §7): no network access, no React, no side effects.
 */

import type { ApiResponse, TaskOrbitUserProfile, UserProfile } from "@/types";

/**
 * GET/PATCH /users/me → legacy `UserProfile`. The TaskOrbit row renames
 * `avatar_url` → `profile_url` / `avatar_public_id` → `profile_public_id`,
 * drops the non-existent `student`/`teacher` detail blocks, and carries no
 * institution membership (`member_status`/`institution_id` have no source —
 * plan.md §6.2). ProfilePage therefore renders base-only (Class B).
 */
export function adaptProfile(
  raw: ApiResponse<TaskOrbitUserProfile>,
): ApiResponse<UserProfile> {
  const { data } = raw;

  if (!data) {
    return { success: raw.success, message: raw.message, meta: raw.meta };
  }

  return {
    success: raw.success,
    message: raw.message,
    meta: raw.meta,
    data: adaptUserRow(data),
  };
}

/**
 * PATCH /users/me/avatar → the old `data: string` (avatar URL) contract
 * (plan.md §5 U3). The new backend answers with the updated user object;
 * only `avatar_url` is extracted.
 */
export function adaptAvatarResponse(
  raw: ApiResponse<TaskOrbitUserProfile>,
): ApiResponse<string> {
  return {
    success: raw.success,
    message: raw.message,
    meta: raw.meta,
    data: raw.data?.avatar_url ?? undefined,
  };
}

function adaptUserRow(row: TaskOrbitUserProfile): UserProfile {
  const adapted = {
    id: row.id,
    name: row.name,
    email: row.email,
    google_id: row.google_id,
    profile_url: row.avatar_url,
    profile_public_id: row.avatar_public_id,
    role: row.role,
    provider: row.provider,
    user_status: row.user_status,
    member_status: "NOT_JOINED",
    is_active: row.is_active,
    is_deleted: row.is_deleted,
    is_verified: row.is_verified,
    institution_id: null,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };

  // The legacy discriminated union only knows Edu-Matrix roles; the TaskOrbit
  // roles (ADMIN/PROJECT_MANAGER/TEAM_MEMBER) are deliberately bridged through
  // it until the cleanup phase retires the legacy `Role` union (plan.md §4 D5,
  // §11.1). Same pattern as AuthGuard's `profile.role as TaskOrbitRole`.
  return adapted as unknown as UserProfile;
}
