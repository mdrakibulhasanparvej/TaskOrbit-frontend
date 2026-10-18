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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetProfile, useGetProjects, useGetTasks } from "@/hooks";
import useDebounce from "@/hooks/debounce.hook";
import type { TaskListItem } from "@/types";

function MyTasksContent() {
  const searchParams = useSearchParams();
  const urlProjectId = searchParams.get("projectId");
  const { data: profileData } = useGetProfile();
  const profile = profileData?.data;
  // D-9: best-effort project picker — GET /projects is PM+ADMIN on the
  // backend, so for a TEAM_MEMBER this 401s and the list simply stays
  // empty (the ?projectId= deep link remains the working path).
  const { data: projectsData } = useGetProjects({ limit: 100 });
  const projects = projectsData?.data ?? [];
  const [pickedProjectId, setPickedProjectId] = useState<string | null>(null);
  const [filters, setFilters] =
    useState<TaskFilterValues>(DEFAULT_TASK_FILTERS);
  const [activeTask, setActiveTask] = useState<TaskListItem | null>(null);
  const debouncedSearch = useDebounce(filters.search, 400);

  // D-9 priority: URL param → picked project → first project → none.
  const activeProjectId =
    urlProjectId ?? pickedProjectId ?? projects[0]?.id ?? null;

  const tasksQuery = useGetTasks({
    // Gate on the profile too, so the first fetch always carries
    // `assigneeId = current user` (D-9 / instruction #7).
    projectId: profile && activeProjectId ? activeProjectId : "",
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
          Tasks assigned to you, scoped to the selected project.
        </p>
      </header>

      {projects.length > 0 && (
        <Select
          items={projects.map((project) => ({
            value: project.id,
            label: project.name,
          }))}
          value={activeProjectId ?? ""}
          onValueChange={(value) => {
            if (value) setPickedProjectId(value);
          }}
        >
          <SelectTrigger className="w-full sm:max-w-xs" aria-label="Project">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {!activeProjectId ? (
        <div className="rounded-xl border bg-card px-6 py-12 text-center">
          <p className="font-medium">Select a project to see your tasks</p>
          <p className="mt-1 text-sm text-muted-foreground">
            You can access this page from a project&apos;s board.
          </p>
        </div>
      ) : (
        <>
          <TaskFilters
            value={filters}
            onChange={(patch) => setFilters((prev) => ({ ...prev, ...patch }))}
          />
          <TaskList
            tasks={tasks}
            isLoading={tasksQuery.isLoading}
            onSelect={setActiveTask}
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
        </>
      )}

      <TaskDetailsSheet
        projectId={activeProjectId ?? ""}
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
        <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </section>
      }
    >
      <MyTasksContent />
    </Suspense>
  );
}
