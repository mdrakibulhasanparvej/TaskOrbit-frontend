import apiClient from "@/lib/ofetch";
import type {
  ApiResponse,
  ChangePasswordPayload,
  TaskOrbitUserProfile,
  UserProfileUpdatePayload,
} from "@/types";
import { adaptAvatarResponse, adaptProfile } from "./adapters";

const prefix = "/users";

/** U1 — GET /users/me (path + response adapted; plan.md §5 U1). */
export const getProfile = async () => {
  const raw = await apiClient<ApiResponse<TaskOrbitUserProfile>>(
    `${prefix}/me`,
  );
  return adaptProfile(raw);
};

/**
 * U3 — PATCH /users/me/avatar. Multipart field renamed `picture` → `avatar`;
 * the updated-user response is adapted back to the old `data: string` contract
 * (plan.md §5 U3).
 */
export const updatedProfilePicture = async (picture: File) => {
  const formData = new FormData();
  formData.append("avatar", picture);

  const raw = await apiClient<ApiResponse<TaskOrbitUserProfile>>(
    `${prefix}/me/avatar`,
    {
      method: "PATCH",
      body: formData,
    },
  );
  return adaptAvatarResponse(raw);
};

/** U2 — PATCH /users/me; payload is a superset (UI sends `name` only). */
export const updateUserProfile = async (payload: UserProfileUpdatePayload) => {
  const raw = await apiClient<ApiResponse<TaskOrbitUserProfile>>(
    `${prefix}/me`,
    {
      method: "PATCH",
      body: payload,
    },
  );
  return adaptProfile(raw);
};

/** U4 — PATCH /users/me/password (new; no legacy equivalent). */
export const changePassword = (payload: ChangePasswordPayload) => {
  return apiClient<ApiResponse<undefined>>(`${prefix}/me/password`, {
    method: "PATCH",
    body: payload,
  });
};
