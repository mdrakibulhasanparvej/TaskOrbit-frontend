import apiClient from "@/lib/ofetch";
import type {
  ApiResponse,
  Board,
  CreateTaskPayload,
  TaskDetail,
  TaskListItem,
  TaskStatus,
  TasksQuery,
  UpdateTaskPayload,
} from "@/types";

const prefix = "/tasks";

/**
 * GET /tasks — paginated list (plan.md §9). `projectId` is a REQUIRED
 * query param — the backend 400s without it, so callers must always
 * provide one (enforced by the `TasksQuery` type).
 */
export const getTasks = (query: TasksQuery) => {
  return apiClient<ApiResponse<TaskListItem[]>>(prefix, {
    query,
  });
};

/** POST /tasks — create task (guard: PM). */
export const createTask = (payload: CreateTaskPayload) => {
  return apiClient<ApiResponse<TaskListItem>>(prefix, {
    method: "POST",
    body: payload,
  });
};

/** GET /tasks/board?projectId= — Kanban board, 4 columns (plan.md §6.3). */
export const getBoard = (projectId: string) => {
  return apiClient<ApiResponse<Board>>(`${prefix}/board`, {
    query: { projectId },
  });
};

/** GET /tasks/:id — full detail incl. creator + project nest. */
export const getTaskById = (taskId: string) => {
  return apiClient<ApiResponse<TaskDetail>>(`${prefix}/${taskId}`);
};

/** PATCH /tasks/:id — partial update (guard: PM). `status` NEVER included. */
export const updateTask = (taskId: string, payload: UpdateTaskPayload) => {
  return apiClient<ApiResponse<TaskDetail>>(`${prefix}/${taskId}`, {
    method: "PATCH",
    body: payload,
  });
};

/** DELETE /tasks/:id — delete task (guard: PM, ADMIN). */
export const deleteTask = (taskId: string) => {
  return apiClient<ApiResponse<null>>(`${prefix}/${taskId}`, {
    method: "DELETE",
  });
};

/** PATCH /tasks/:id/status — column move (guard: auth; ADMIN blocked). */
export const moveTask = (taskId: string, status: TaskStatus) => {
  return apiClient<ApiResponse<TaskDetail>>(`${prefix}/${taskId}/status`, {
    method: "PATCH",
    body: { status },
  });
};

/** PATCH /tasks/:id/assign — set/clear assignee (guard: PM). */
export const assignTask = (taskId: string, assigneeId: string | null) => {
  return apiClient<ApiResponse<TaskDetail>>(`${prefix}/${taskId}/assign`, {
    method: "PATCH",
    body: { assigneeId },
  });
};
