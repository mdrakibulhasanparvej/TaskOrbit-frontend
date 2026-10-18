import apiClient from "@/lib/ofetch";
import type {
  AdminPayment,
  AdminProject,
  AdminReportsResponse,
  AdminUpdateSettingsPayload,
  AdminUpdateUserRolePayload,
  AdminUpdateUserStatusPayload,
  AdminUser,
  ApiResponse,
  PlatformSettings,
  Query,
} from "@/types";

// Admin routes (plan.md §9 — every route is ADMIN-only on the backend):
//   GET    /admin/users                · PATCH /admin/users/:id/status
//   PATCH  /admin/users/:id/role       · GET   /admin/projects
//   DELETE /admin/projects/:id         · GET   /admin/payments
//   GET    /admin/reports              · GET/PATCH /admin/settings
const prefix = "/admin";

/** A1 — GET /admin/users (paginated, searchable directory). */
export const getAdminUsers = (query: Query = {}) => {
  return apiClient<ApiResponse<AdminUser[]>>(`${prefix}/users`, { query });
};

/** A2 — PATCH /admin/users/:id/status {user_status}. */
export const updateAdminUserStatus = (
  userId: string,
  payload: AdminUpdateUserStatusPayload,
) => {
  return apiClient<ApiResponse<AdminUser>>(`${prefix}/users/${userId}/status`, {
    method: "PATCH",
    body: payload,
  });
};

/** A3 — PATCH /admin/users/:id/role {role}. */
export const updateAdminUserRole = (
  userId: string,
  payload: AdminUpdateUserRolePayload,
) => {
  return apiClient<ApiResponse<AdminUser>>(`${prefix}/users/${userId}/role`, {
    method: "PATCH",
    body: payload,
  });
};

/** A4 — GET /admin/projects (platform-wide, paginated). */
export const getAdminProjects = (query: Query = {}) => {
  return apiClient<ApiResponse<AdminProject[]>>(`${prefix}/projects`, {
    query,
  });
};

/** A5 — DELETE /admin/projects/:id (audited admin bypass). */
export const deleteAdminProject = (projectId: string) => {
  return apiClient<ApiResponse<{ id: string; name: string }>>(
    `${prefix}/projects/${projectId}`,
    { method: "DELETE" },
  );
};

/** A6 — GET /admin/payments (all users; same row shape as P2 history). */
export const getAdminPayments = (query: Query = {}) => {
  return apiClient<ApiResponse<AdminPayment[]>>(`${prefix}/payments`, {
    query,
  });
};

/** A7 — GET /admin/reports (audit logs + totals + top projects). */
export const getAdminReports = (query: Query = {}) => {
  return apiClient<ApiResponse<AdminReportsResponse>>(`${prefix}/reports`, {
    query,
  });
};

/** A8a — GET /admin/settings (resolved defaults, never null). */
export const getAdminSettings = () => {
  return apiClient<ApiResponse<PlatformSettings>>(`${prefix}/settings`);
};

/** A8b — PATCH /admin/settings (partial update, ≥1 field). */
export const updateAdminSettings = (payload: AdminUpdateSettingsPayload) => {
  return apiClient<ApiResponse<PlatformSettings>>(`${prefix}/settings`, {
    method: "PATCH",
    body: payload,
  });
};
