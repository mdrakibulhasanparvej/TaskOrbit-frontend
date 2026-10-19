"use client";

import { IconPlus, IconRefresh } from "@tabler/icons-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetBoard, useGetProfile } from "@/hooks";
import { TASK_STATUSES, type TaskListItem, type TaskOrbitRole } from "@/types";
import KanbanColumn from "./KanbanColumn";
import TaskDetailsSheet from "./TaskDetailsSheet";
import TaskForm from "./TaskForm";

export default function KanbanBoard({
  projectId,
  readOnly = false,
}: {
  projectId: string;
  readOnly?: boolean;
}) {
  const { data, isLoading, isError, refetch } = useGetBoard(projectId);
  const { data: profileData } = useGetProfile();
  // Phase-03 profile is typed with the legacy `Role` union; the runtime
  // value is always a TaskOrbit role (same assumption as RoleGuard, D5).
  const role = profileData?.data?.role as TaskOrbitRole | undefined;
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<TaskListItem | null>(null);
  const board = data?.data;

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {TASK_STATUSES.map((status) => (
          <Skeleton key={status} className="h-72 rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError || !board) {
    return (
      <div className="rounded-xl border bg-card px-6 py-12 text-center">
        <p className="font-medium">Couldn&apos;t load the board.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          It may have been deleted, or you may not have access to it.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-4"
          onClick={() => void refetch()}
        >
          <IconRefresh aria-hidden="true" />
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Use a task&apos;s detail panel to move it between columns — moves go
          through the status endpoint, never the edit form.
        </p>
        {!readOnly && role === "PROJECT_MANAGER" && (
          <Button
            type="button"
            size="sm"
            className="shrink-0"
            onClick={() => setIsFormOpen(true)}
          >
            <IconPlus aria-hidden="true" />
            New task
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {TASK_STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={board[status]}
            onSelect={setActiveTask}
          />
        ))}
      </div>

      {!readOnly && (
        <TaskForm
          projectId={projectId}
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
        />
      )}

      <TaskDetailsSheet
        projectId={projectId}
        taskId={activeTask?.id ?? ""}
        open={Boolean(activeTask)}
        onOpenChange={(open) => {
          if (!open) setActiveTask(null);
        }}
      />
    </div>
  );
}
