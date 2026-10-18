import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createComment,
  deleteComment,
  getComments,
  updateComment,
} from "@/api";
import type { CommentPayload, ThreadResponse } from "@/types";

// Query key (plan.md scope step 4): ["comments", taskId] — one 1-level thread
// per task. Mutations also refresh ["task", taskId] and ["tasks"] so the
// `_count.comments` shown on the board/header stays in sync.

export const useGetComments = (taskId: string) => {
  return useQuery({
    queryKey: ["comments", taskId],
    queryFn: async (): Promise<ThreadResponse> => {
      const response = await getComments(taskId);
      return {
        comments: response.data ?? [],
        page: response.meta?.page ?? 1,
        limit: response.meta?.limit ?? 20,
        totalPages: response.meta?.totalPages ?? 1,
      };
    },
    enabled: Boolean(taskId),
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      taskId,
      payload,
    }: {
      taskId: string;
      payload: CommentPayload;
    }) => createComment(taskId, payload),
    onSuccess: (_data, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: ["comments", taskId] });
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    // `taskId` rides along for invalidation only — the PATCH body is `body`.
    mutationFn: ({
      commentId,
      body,
    }: {
      commentId: string;
      taskId: string;
      body: string;
    }) => updateComment(commentId, body),
    onSuccess: (_data, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: ["comments", taskId] });
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    // `taskId` rides along for invalidation only.
    mutationFn: ({ commentId }: { commentId: string; taskId: string }) =>
      deleteComment(commentId),
    onSuccess: (_data, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: ["comments", taskId] });
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};
