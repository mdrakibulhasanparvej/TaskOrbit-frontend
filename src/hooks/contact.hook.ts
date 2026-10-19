import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createContactMessage,
  getContactMessages,
  updateContactMessageStatus,
} from "@/api";
import type { ContactStatusPayload, Query } from "@/types";

// Query key (Phase 08): ["contact"] — inbox list; status changes refetch it.

export const useCreateContactMessage = () => {
  return useMutation({
    mutationFn: createContactMessage,
  });
};

export const useGetContactMessages = (query: Query = {}) => {
  return useQuery({
    queryKey: ["contact", query],
    queryFn: () => getContactMessages(query),
  });
};

const CONTACT_UNREAD_POLL_INTERVAL_MS = 60_000;

/**
 * Unread (NEW) contact-message count for the admin sidebar badge — mirrors the
 * notification unread counter. Reuses the paginated inbox endpoint with
 * `limit=1` and reads `meta.dataCount`, so no dedicated endpoint is needed.
 * `useUpdateContactMessageStatus` invalidates the same `["contact"]` prefix.
 */
export const useGetUnreadContactCount = (enabled = true) => {
  return useQuery({
    queryKey: ["contact", { status: "NEW", page: 1, limit: 1 }],
    queryFn: () => getContactMessages({ status: "NEW", page: 1, limit: 1 }),
    enabled,
    refetchInterval: enabled ? CONTACT_UNREAD_POLL_INTERVAL_MS : false,
    select: (response) => response.meta?.dataCount ?? 0,
  });
};

export const useUpdateContactMessageStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      messageId,
      payload,
    }: {
      messageId: string;
      payload: ContactStatusPayload;
    }) => updateContactMessageStatus(messageId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact"] });
    },
  });
};
