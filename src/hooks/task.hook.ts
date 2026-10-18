import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  assignTask,
  createTask,
  deleteTask,
  getBoard,
  getTaskById,
  getTasks,
  moveTask,
  updateTask,
} from "@/api";
import type { TaskStatus, TasksQuery, UpdateTaskPayload } from "@/types";

// Query keys (plan.md scope step 4):
//   ["tasks", { projectId, ...filters }]  — paginated/filtered list
//   ["tasks", "board", projectId]         — Kanban board
//   ["task", id]                          — single task detail
// `["tasks"]` prefix-invalidation covers every list + board query.

export const useGetTasks = (query: TasksQuery) => {
  return useQuery({
    queryKey: ["tasks", query],
    queryFn: () => getTasks(query),
    enabled: Boolean(query.projectId),
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTask,
    onSuccess: (_data, payload) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({
        queryKey: ["tasks", "board", payload.projectId],
      });
    },
  });
};

export const useGetBoard = (projectId: string) => {
  return useQuery({
    queryKey: ["tasks", "board", projectId],
    queryFn: () => getBoard(projectId),
    enabled: Boolean(projectId),
  });
};

export const useGetTaskById = (taskId: string) => {
  return useQuery({
    queryKey: ["task", taskId],
    queryFn: () => getTaskById(taskId),
    enabled: Boolean(taskId),
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    // `projectId` rides along for board invalidation only — it is never
    // sent in the PATCH body (`status`/`projectId` excluded, plan.md §9).
    mutationFn: ({
      taskId,
      payload,
    }: {
      taskId: string;
      payload: UpdateTaskPayload;
      projectId: string;
    }) => updateTask(taskId, payload),
    onSuccess: (_data, { taskId, projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({
        queryKey: ["tasks", "board", projectId],
      });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    // `projectId` rides along for board invalidation only (see above).
    mutationFn: ({ taskId }: { taskId: string; projectId: string }) =>
      deleteTask(taskId),
    onSuccess: (_data, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({
        queryKey: ["tasks", "board", projectId],
      });
    },
  });
};

export const useMoveTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    // `projectId` rides along for board invalidation only.
    mutationFn: ({
      taskId,
      status,
    }: {
      taskId: string;
      status: TaskStatus;
      projectId: string;
    }) => moveTask(taskId, status),
    onSuccess: (_data, { taskId, projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({
        queryKey: ["tasks", "board", projectId],
      });
    },
  });
};

export const useAssignTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    // `projectId` rides along for board invalidation only.
    mutationFn: ({
      taskId,
      assigneeId,
    }: {
      taskId: string;
      assigneeId: string | null;
      projectId: string;
    }) => assignTask(taskId, assigneeId),
    onSuccess: (_data, { taskId, projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({
        queryKey: ["tasks", "board", projectId],
      });
    },
  });
};
