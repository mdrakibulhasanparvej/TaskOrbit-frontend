import apiClient from "@/lib/ofetch";
import type {
  ApiResponse,
  TaskOrbitAdminAnalytics,
  TaskOrbitManagerAnalytics,
  TaskOrbitMemberAnalytics,
  TaskOrbitProjectAnalytics,
} from "@/types";
import {
  adaptAdminAnalytics,
  adaptManagerAnalytics,
  adaptMemberAnalytics,
  adaptProjectAnalytics,
} from "./adapters";

const prefix = "/analytics";

/** N1 — GET /analytics/admin (auth, ADMIN; plan.md §5 N1). */
export const getAdminAnalytics = async () => {
  const raw = await apiClient<ApiResponse<TaskOrbitAdminAnalytics>>(
    `${prefix}/admin`,
  );

  return adaptAdminAnalytics(raw);
};

/** N2 — GET /analytics/manager (auth, PROJECT_MANAGER; plan.md §5 N2). */
export const getManagerAnalytics = async () => {
  const raw = await apiClient<ApiResponse<TaskOrbitManagerAnalytics>>(
    `${prefix}/manager`,
  );

  return adaptManagerAnalytics(raw);
};

/** N3 — GET /analytics/member (auth, TEAM_MEMBER; plan.md §5 N3). */
export const getMemberAnalytics = async () => {
  const raw = await apiClient<ApiResponse<TaskOrbitMemberAnalytics>>(
    `${prefix}/member`,
  );

  return adaptMemberAnalytics(raw);
};

/** N4 — GET /analytics/project/:projectId (auth, PM owner-only; §5 N4). */
export const getProjectAnalytics = async (projectId: string) => {
  const raw = await apiClient<ApiResponse<TaskOrbitProjectAnalytics>>(
    `${prefix}/project/${projectId}`,
  );

  return adaptProjectAnalytics(raw);
};
