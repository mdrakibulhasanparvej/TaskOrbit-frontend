/**
 * Attachment domain types — NEW in Phase 07 (plan.md §6.3, §9 Attachments).
 *
 * Uploads are multipart with the field name `files` (array, ≤5 files, ≤10MB
 * each) and are gated by the project owner's plan — a FREE plan returns
 * 403 ("File attachments require a Pro or Business plan").
 */

/** Uploader nest on an attachment row (`{id, name, avatar_url}`). */
export interface AttachmentUploader {
  id: string;
  name: string;
  avatar_url: string | null;
}

/** Attachment row — GET/POST `/tasks/:taskId/attachments`. */
export interface Attachment {
  id: string;
  file_name: string;
  url: string;
  mime_type: string;
  size: number;
  task_id: string;
  created_at: string;
  uploaded_by: AttachmentUploader;
}

/**
 * Body — POST `/tasks/:taskId/attachments`. Serialized as multipart FormData
 * under the field name `files` (never `file` singular).
 */
export interface UploadPayload {
  files: File[];
}
