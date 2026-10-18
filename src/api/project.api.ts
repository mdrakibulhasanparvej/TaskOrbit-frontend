import apiClient from "@/lib/ofetch";
import type {
  ApiResponse,
  CreateProjectPayload,
  Invitation,
  Project,
  ProjectDetail,
  ProjectMember,
  ProjectsQuery,
  UpdateProjectPayload,
} from "@/types";

const prefix = "/projects";

/** GET /projects — paginated list (query: page, limit, search, status, sortBy, sortOrder). */
export const getProjects = (query: ProjectsQuery = {}) => {
  return apiClient<ApiResponse<Project[]>>(prefix, {
    query,
  });
};

/** POST /projects — create project (guard: PM). */
export const createProject = (payload: CreateProjectPayload) => {
  return apiClient<ApiResponse<Project>>(prefix, {
    method: "POST",
    body: payload,
  });
};

/** GET /projects/:id — full detail incl. members. */
export const getProjectById = (projectId: string) => {
  return apiClient<ApiResponse<ProjectDetail>>(`${prefix}/${projectId}`);
};

/** PATCH /projects/:id — partial update (guard: PM owner/ADMIN). */
export const updateProject = (
  projectId: string,
  payload: UpdateProjectPayload,
) => {
  return apiClient<ApiResponse<Project>>(`${prefix}/${projectId}`, {
    method: "PATCH",
    body: payload,
  });
};

/** DELETE /projects/:id — delete project (guard: PM owner/ADMIN). */
export const deleteProject = (projectId: string) => {
  return apiClient<ApiResponse<null>>(`${prefix}/${projectId}`, {
    method: "DELETE",
  });
};

/** GET /projects/:id/members — member list (guard: PM, ADMIN). */
export const getProjectMembers = (projectId: string) => {
  return apiClient<ApiResponse<ProjectMember[]>>(
    `${prefix}/${projectId}/members`,
  );
};

/** DELETE /projects/:id/members/:memberId — remove member (guard: PM). */
export const removeProjectMember = (projectId: string, memberId: string) => {
  return apiClient<ApiResponse<null>>(
    `${prefix}/${projectId}/members/${memberId}`,
    {
      method: "DELETE",
    },
  );
};

/** POST /projects/:id/invitations — invite by email (guard: PM). */
export const inviteMember = (projectId: string, email: string) => {
  return apiClient<ApiResponse<Invitation>>(
    `${prefix}/${projectId}/invitations`,
    {
      method: "POST",
      body: { email },
    },
  );
};

/** GET /projects/:id/invitations — invitations sent for a project (guard: PM). */
export const getProjectInvitations = (projectId: string) => {
  return apiClient<ApiResponse<Invitation[]>>(
    `${prefix}/${projectId}/invitations`,
  );
};

/** GET /projects/invitations/mine — invitations addressed to me (guard: auth). */
export const getMyInvitations = () => {
  return apiClient<ApiResponse<Invitation[]>>(`${prefix}/invitations/mine`);
};

/** POST /projects/invitations/accept — accept by token (body: {token}). */
export const acceptInvitation = (token: string) => {
  return apiClient<ApiResponse<null>>(`${prefix}/invitations/accept`, {
    method: "POST",
    body: { token },
  });
};

/** POST /projects/invitations/decline — decline by token (body: {token}). */
export const declineInvitation = (token: string) => {
  return apiClient<ApiResponse<null>>(`${prefix}/invitations/decline`, {
    method: "POST",
    body: { token },
  });
};
