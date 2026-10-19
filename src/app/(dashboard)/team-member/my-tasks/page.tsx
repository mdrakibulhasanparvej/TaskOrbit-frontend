"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import TaskDetailsSheet from "@/components/modules/task/TaskDetailsSheet";
import TaskFilters, {
  DEFAULT_TASK_FILTERS,
  type TaskFilterValues,
} from "@/components/modules/task/TaskFilters";
import TaskList from "@/components/modules/task/TaskList";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetProfile, useGetTasks } from "@/hooks";
import useDebounce from "@/hooks/debounce.hook";
import type { TaskListItem } from "@/types";

function MyTasksContent() {
  const searchParams = useSearchParams();
  const urlProjectId = searchParams.get("projectId");
  const { data: profileData } = useGetProfile();
  const profile = profileData?.data;

  // The URL query parameter is the single source of truth for the active project.
  const activeProjectId = urlProjectId;

  const [filters, setFilters] =
    useState<TaskFilterValues>(DEFAULT_TASK_FILTERS);
  const [activeTask, setActiveTask] = useState<TaskListItem | null>(null);
  const debouncedSearch = useDebounce(filters.search, 400);

  // 🎯 টাস্ক ফেচ করা
  const tasksQuery = useGetTasks({
    projectId: activeProjectId ?? undefined,
    assigneeId: profile?.id,
    search: debouncedSearch || undefined,
    status: filters.status === "ALL" ? undefined : filters.status,
    priority: filters.priority === "ALL" ? undefined : filters.priority,
    limit: 50,
  });

  const tasks = tasksQuery.data?.data ?? [];

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <header>
        <h1 className="font-heading text-2xl font-semibold sm:text-3xl">
          My tasks
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {activeProjectId
            ? "Tasks assigned to you in this project."
            : "Tasks assigned to you across all your projects."}
        </p>
      </header>

      <TaskFilters
        value={filters}
        onChange={(patch) => setFilters((prev) => ({ ...prev, ...patch }))}
      />
      <TaskList
        tasks={tasks}
        isLoading={tasksQuery.isLoading}
        onSelect={setActiveTask}
        onEdit={setActiveTask}
      />
      {tasksQuery.isError && (
        <div className="rounded-xl border bg-card px-6 py-8 text-center">
          <p className="font-medium">Couldn&apos;t load your tasks.</p>
          <Button
            type="button"
            variant="outline"
            className="mt-3"
            onClick={() => void tasksQuery.refetch()}
          >
            Try again
          </Button>
        </div>
      )}

      <TaskDetailsSheet
        projectId={activeTask?.project_id ?? activeProjectId ?? ""}
        taskId={activeTask?.id ?? ""}
        open={Boolean(activeTask)}
        onOpenChange={(open) => {
          if (!open) setActiveTask(null);
        }}
      />
    </section>
  );
}

export default function MyTasksPage() {
  return (
    <Suspense
      fallback={
        <section className="p-6">
          <Skeleton className="h-64 rounded-xl" />
        </section>
      }
    >
      <MyTasksContent />
    </Suspense>
  );
}