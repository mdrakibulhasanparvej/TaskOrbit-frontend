import z from "zod";

/** Mirrors the backend cap (comment.schema.ts — 5000 characters). */
const COMMENT_MAX_LENGTH = 5000;

const commentBodySchema = z
  .string("Comment body is required")
  .trim()
  .min(1, "Comment body can't be empty")
  .max(
    COMMENT_MAX_LENGTH,
    `Comment body can't be more than ${COMMENT_MAX_LENGTH} characters`,
  );

/**
 * Body of POST /tasks/:taskId/comments — `parent_id` targets a top-level
 * comment only (threading is capped at one level).
 */
export const createCommentSchema = z.object({
  body: commentBodySchema,
  parent_id: z
    .string("Parent must be a comment id")
    .min(1, "Parent must be a comment id")
    .nullish(),
});

/** Body of PATCH /tasks/comments/:commentId — body only (author-only edit). */
export const updateCommentSchema = z.object({
  body: commentBodySchema,
});

export type CreateCommentValues = z.infer<typeof createCommentSchema>;
export type UpdateCommentValues = z.infer<typeof updateCommentSchema>;
