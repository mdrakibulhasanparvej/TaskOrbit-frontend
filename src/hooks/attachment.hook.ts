import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteAttachment, getAttachments, uploadAttachments } from "@/api";
import type { UploadPayload } from "@/types";

// Query key (plan.md scope step 8): ["attachments", taskId].

export const useGetAttachments = (taskId: string) => {
  return useQuery({
    queryKey: ["attachments", taskId],
    queryFn: () => getAttachments(taskId),
    enabled: Boolean(taskId),
  });
};

export const useUploadAttachments = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      taskId,
      payload,
    }: {
      taskId: string;
      payload: UploadPayload;
    }) => uploadAttachments(taskId, payload),
    onSuccess: (_data, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: ["attachments", taskId] });
    },
  });
};

export const useDeleteAttachment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    // `taskId` rides along for invalidation only.
    mutationFn: ({ attachmentId }: { attachmentId: string; taskId: string }) =>
      deleteAttachment(attachmentId),
    onSuccess: (_data, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: ["attachments", taskId] });
    },
  });
};
