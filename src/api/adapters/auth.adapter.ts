/**
 * Auth response adapters — TaskOrbit DTO → legacy Edu-Matrix contract.
 * Pure functions only (plan.md §7): no network access, no React, no side effects.
 */

import type { FetchError } from "ofetch";
import type {
  ApiResponse,
  TaskOrbitLoginResponse,
  TaskOrbitRole,
  TaskOrbitVerifyEmailData,
} from "@/types";

/**
 * Adapted `data` of POST /auth/login — the legacy contract keeps `role` at the
 * top level (TaskOrbit nests it under `data.user.role`). Session tokens travel
 * in the body only outside production, so they are optional here; the httpOnly
 * cookies are the real mechanism (plan.md §5 A1, §6.2).
 */
export interface AdaptedLoginData {
  role: TaskOrbitRole | null;
  access_token?: string;
  refresh_token?: string;
}

export type AdaptedLoginResponse = ApiResponse<AdaptedLoginData>;

/**
 * Raw `data` of POST /auth/verify-email. The TaskOrbit controller wraps the
 * verified user in `{ user }`; the planner's flat shape (plan.md §6.2) is
 * accepted as well so the adapter stays correct against either contract.
 */
type RawVerifyEmailData =
  | TaskOrbitVerifyEmailData
  | {
      user: TaskOrbitVerifyEmailData;
      access_token?: string;
      refresh_token?: string;
    };

export type TaskOrbitVerifyEmailResponse = ApiResponse<RawVerifyEmailData>;

/**
 * Adapted `data` of POST /auth/verify-email — the old double-wrapped
 * `ApiResponse<ApiResponse<…>>` is flattened into one level and `role` is
 * surfaced for the caller (plan.md §5 A3).
 */
export interface AdaptedVerifyEmailData {
  role: TaskOrbitRole;
  user: TaskOrbitVerifyEmailData;
  access_token?: string;
  refresh_token?: string;
}

export type AdaptedVerifyEmailResponse = ApiResponse<AdaptedVerifyEmailData>;

/** POST /auth/login → legacy `{ role, access_token?, refresh_token? }`. */
export function adaptLogin(raw: TaskOrbitLoginResponse): AdaptedLoginResponse {
  const { data } = raw;

  if (!data) {
    return { success: raw.success, message: raw.message, meta: raw.meta };
  }

  return {
    success: raw.success,
    message: raw.message,
    meta: raw.meta,
    data: {
      role: data.user.role,
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    },
  };
}

/** POST /auth/verify-email → single-level `{ role, user, tokens? }`. */
export function adaptVerifyEmail(
  raw: TaskOrbitVerifyEmailResponse,
): AdaptedVerifyEmailResponse {
  const { data } = raw;

  if (!data) {
    return { success: raw.success, message: raw.message, meta: raw.meta };
  }

  const user = "user" in data ? data.user : data;
  const tokens = "user" in data ? data : undefined;

  return {
    success: raw.success,
    message: raw.message,
    meta: raw.meta,
    data: {
      role: user.role,
      user,
      access_token: tokens?.access_token,
      refresh_token: tokens?.refresh_token,
    },
  };
}

/**
 * POST /auth/logout is guarded on the backend and answers 400 "You are not
 * logged in…" when the session is already gone. Swallow only that case so the
 * logout button never toasts a false error (plan.md §5 A4).
 */
export async function silenceLogoutNotLoggedIn(
  request: () => Promise<ApiResponse<undefined>>,
): Promise<ApiResponse<undefined>> {
  try {
    return await request();
  } catch (error) {
    const fetchError = error as FetchError<{ message?: string }>;

    if (
      fetchError.response?.status === 400 &&
      /not logged in/i.test(fetchError.data?.message ?? "")
    ) {
      return { success: true, message: "Logout successful" };
    }

    throw error;
  }
}
