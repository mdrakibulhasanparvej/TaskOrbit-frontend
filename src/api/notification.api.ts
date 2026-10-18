import apiClient from "@/lib/ofetch";
import type {
  ApiResponse,
  Notification,
  NotificationsQuery,
  UnreadCount,
} from "@/types";

const prefix = "/notifications";

/** GET /notifications — paginated feed; `unreadOnly=true` filters unread. */
export const getNotifications = (query: NotificationsQuery = {}) => {
  return apiClient<ApiResponse<Notification[]>>(prefix, {
    query: {
      page: query.page,
      limit: query.limit,
      unreadOnly: query.unreadOnly ? "true" : undefined,
    },
  });
};

/** GET /notifications/unread-count → `{ unreadCount }` (camelCase). */
export const getUnreadCount = () => {
  return apiClient<ApiResponse<UnreadCount>>(`${prefix}/unread-count`);
};

/** PATCH /notifications/read-all — mark every unread row read. */
export const markAllNotificationsRead = () => {
  return apiClient<ApiResponse<{ updated: number }>>(`${prefix}/read-all`, {
    method: "PATCH",
  });
};

/** PATCH /notifications/:id/read — mark a single row read. */
export const markNotificationRead = (notificationId: string) => {
  return apiClient<ApiResponse<{ id: string; is_read: boolean }>>(
    `${prefix}/${notificationId}/read`,
    {
      method: "PATCH",
    },
  );
};
