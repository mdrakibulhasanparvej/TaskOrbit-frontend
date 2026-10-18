import apiClient from "@/lib/ofetch";
import type { ApiResponse, Attachment, UploadPayload } from "@/types";

// Attachment routes share the `/tasks` mount prefix (plan.md §9):
//   POST/GET  /tasks/:taskId/attachments
//   DELETE    /tasks/attachments/:attachmentId
const prefix = "/tasks";

/**
 * POST /tasks/:taskId/attachments — multipart upload (guard: PM, TM).
 * The FormData field name is `files` (array) — the backend reads
 * `upload.array("files", 5)`, so `file` singular would be dropped.
 */
export const uploadAttachments = (taskId: string, { files }: UploadPayload) => {
  const formData = new FormData();
  for (const file of files) {
    formData.append("files", file);
  }

  return apiClient<ApiResponse<Attachment[]>>(
    `${prefix}/${taskId}/attachments`,
    {
      method: "POST",
      body: formData,
    },
  );
};

/** GET /tasks/:taskId/attachments — metadata list (guard: auth). */
export const getAttachments = (taskId: string) => {
  return apiClient<ApiResponse<Attachment[]>>(
    `${prefix}/${taskId}/attachments`,
  );
};

/** DELETE /tasks/attachments/:attachmentId (guard: PM, TM). */
export const deleteAttachment = (attachmentId: string) => {
  return apiClient<ApiResponse<{ id: string; file_name: string }>>(
    `${prefix}/attachments/${attachmentId}`,
    {
      method: "DELETE",
    },
  );
};
