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
