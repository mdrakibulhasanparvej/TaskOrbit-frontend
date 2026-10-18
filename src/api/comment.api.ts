import apiClient from "@/lib/ofetch";
import type { ApiResponse, Comment, CommentPayload } from "@/types";

// Comment routes share the `/tasks` mount prefix (plan.md §9):
//   GET/POST  /tasks/:taskId/comments
//   PATCH/DELETE /tasks/comments/:commentId
const prefix = "/tasks";

/** GET /tasks/:taskId/comments — paginated 1-level thread (guard: auth). */
export const getComments = (
  taskId: string,
  query: { page?: number; limit?: number } = {},
) => {
  return apiClient<ApiResponse<Comment[]>>(`${prefix}/${taskId}/comments`, {
    query,
  });
};

/** POST /tasks/:taskId/comments — create a comment or a reply (guard: PM, TM). */
export const createComment = (taskId: string, payload: CommentPayload) => {
  return apiClient<ApiResponse<Comment>>(`${prefix}/${taskId}/comments`, {
    method: "POST",
    body: payload,
  });
};

/** PATCH /tasks/comments/:commentId — edit a comment (guard: auth + author). */
export const updateComment = (commentId: string, body: string) => {
  return apiClient<ApiResponse<Comment>>(`${prefix}/comments/${commentId}`, {
    method: "PATCH",
    body: { body },
  });
};

/** DELETE /tasks/comments/:commentId — delete (guard: PM, ADMIN). */
export const deleteComment = (commentId: string) => {
  return apiClient<ApiResponse<{ id: string; task_id: string }>>(
    `${prefix}/comments/${commentId}`,
    {
      method: "DELETE",
    },
  );
};
