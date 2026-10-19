import apiClient from "@/lib/ofetch";
import type {
  ApiResponse,
  LoginPayload,
  TaskOrbitLoginResponse,
  TaskOrbitRole,
  verifyEmailPayload,
} from "@/types";
import {
  adaptLogin,
  adaptVerifyEmail,
  silenceLogoutNotLoggedIn,
  type TaskOrbitVerifyEmailResponse,
} from "./adapters";

const prefix = "/auth";

/**
 * JSON body of POST /auth/register — multipart and `photo` are dropped, `role`
 * comes from the visible register select (plan.md §5 A2, OQ-9).
 */
interface RegisterApiPayload {
  name: string;
  email: string;
  password: string;
  role: TaskOrbitRole;
}

/** `{ email }` body shared by POST /auth/resend-otp and POST /auth/forgot-password. */
interface EmailPayload {
  email: string;
}

/** JSON body of POST /auth/reset-password (plan.md §5 A8). */
interface ResetPasswordApiPayload {
  email: string;
  otp: string;
  new_password: string;
}

export const login = async (payload: LoginPayload) => {
  const raw = await apiClient<TaskOrbitLoginResponse>(`${prefix}/login`, {
    method: "POST",
    body: payload,
  });

  return adaptLogin(raw);
};

/** POST /auth/google — exchange a Google ID token for a TaskOrbit session. */
export const googleLogin = async (idToken: string) => {
  const raw = await apiClient<TaskOrbitLoginResponse>(`${prefix}/google`, {
    method: "POST",
    body: { id_token: idToken },
  });

  return adaptLogin(raw);
};

export const register = (payload: RegisterApiPayload) => {
  return apiClient<ApiResponse<undefined>>(`${prefix}/register`, {
    method: "POST",
    body: payload,
  });
};

export const verifyEmail = async (payload: verifyEmailPayload) => {
  const raw = await apiClient<TaskOrbitVerifyEmailResponse>(
    `${prefix}/verify-email`,
    {
      method: "POST",
      body: payload,
    },
  );

  return adaptVerifyEmail(raw);
};

export const logout = () => {
  return silenceLogoutNotLoggedIn(() =>
    apiClient<ApiResponse<undefined>>(`${prefix}/logout`, {
      method: "POST",
    }),
  );
};

export const resendOtp = (payload: EmailPayload) => {
  return apiClient<ApiResponse<undefined>>(`${prefix}/resend-otp`, {
    method: "POST",
    body: payload,
  });
};

export const forgotPassword = (payload: EmailPayload) => {
  return apiClient<ApiResponse<undefined>>(`${prefix}/forgot-password`, {
    method: "POST",
    body: payload,
  });
};

export const resetPassword = (payload: ResetPasswordApiPayload) => {
  return apiClient<ApiResponse<undefined>>(`${prefix}/reset-password`, {
    method: "POST",
    body: payload,
  });
};
