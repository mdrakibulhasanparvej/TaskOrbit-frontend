import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getNotifications,
  getUnreadCount,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/api";
import type { NotificationsQuery } from "@/types";

// Query keys:
//   ["notifications", query]    — paginated feed
//   ["notifications", "unread"] — unread badge count
// Invalidating the ["notifications"] prefix refreshes both. No SSE/websocket
// exists on the backend, so the unread count polls every 60s (C12) on top of
// TanStack Query's default window-focus refetch.

const UNREAD_POLL_INTERVAL_MS = 60_000;

export const useGetNotifications = (query: NotificationsQuery = {}) => {
  return useQuery({
    queryKey: ["notifications", query],
    queryFn: () => getNotifications(query),
  });
};

export const useGetUnreadCount = () => {
  return useQuery({
    queryKey: ["notifications", "unread"],
    queryFn: getUnreadCount,
    refetchInterval: UNREAD_POLL_INTERVAL_MS,
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
