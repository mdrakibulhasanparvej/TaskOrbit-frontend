/**
 * Notification domain types — NEW in Phase 07 (plan.md §6.3, §9
 * Notifications). Notifications are page-only for v1 (OQ-4) — the header
 * bell is deliberately future work.
 */

/** Mirrors the TaskOrbit `NotificationType` enum (prisma enums). */
export type NotificationType =
  | "TASK_ASSIGNED"
  | "TASK_STATUS_CHANGED"
  | "COMMENT_ADDED"
  | "MENTION"
  | "DEADLINE_APPROACHING"
  | "INVITE_RECEIVED"
  | "PAYMENT_SUCCESS";

/** Notification row — GET `/notifications`. */
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  link: string | null;
  actor_id: string | null;
  actor_name: string | null;
  created_at: string;
}

/** `data` of GET `/notifications/unread-count` — camelCase (plan.md §6.3). */
export interface UnreadCount {
  unreadCount: number;
}

/** Query — GET `/notifications` (`unreadOnly` is a string query param). */
export interface NotificationsQuery {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
}
