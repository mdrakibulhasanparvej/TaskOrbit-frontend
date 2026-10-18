/**
 * Comment domain types — NEW in Phase 07 (plan.md §6.3, §9 Comments).
 *
 * Threading is capped at ONE level: `Comment` is a top-level row,
 * `CommentReply` is a child row. Replies never carry their own `replies`
 * array — the backend rejects replies to replies with a 400
 * ("You can reply only to top-level comments", comment.service.ts).
 */

/** Compact author nest on a comment row (`{id, name, avatar_url}`). */
export interface CommentAuthor {
  id: string;
  name: string;
  avatar_url: string | null;
}

/** Reply row — one nesting level, no further `replies`. */
export interface CommentReply {
  id: string;
  body: string;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
  author: CommentAuthor;
}

/** Top-level comment with its replies (GET/POST `/tasks/:taskId/comments`). */
export interface Comment extends CommentReply {
  replies: CommentReply[];
}

/**
 * Body — POST `/tasks/:taskId/comments`. `parent_id` targets a TOP-LEVEL
 * comment only (one level of replies), so it is optional.
 */
export interface CommentPayload {
  body: string;
  parent_id?: string | null;
}

/** Normalized thread returned by the comments hook (data + pagination meta). */
export interface ThreadResponse {
  comments: Comment[];
  page: number;
  limit: number;
  totalPages: number;
}
