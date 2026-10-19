"use client";

import { IconPencil } from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetProfile } from "@/hooks";
import type { TaskListItem, TaskOrbitRole } from "@/types";
import getInitials from "@/utils/getInitials";
import TaskPriorityBadge from "./TaskPriorityBadge";
import TaskStatusBadge from "./TaskStatusBadge";

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function TaskList({
  tasks,
  onSelect,
  onEdit,
  isLoading = false,
}: {
  tasks: TaskListItem[];
  onSelect: (task: TaskListItem) => void;
  onEdit?: (task: TaskListItem) => void;
  isLoading?: boolean;
}) {
  const { data } = useGetProfile();
  // Phase-03 profile is typed with the legacy `Role` union; the runtime
  // value is always a TaskOrbit role (same assumption as RoleGuard, D5).
  const role = data?.data?.role as TaskOrbitRole | undefined;

  if (isLoading) {
    return <Skeleton className="h-64 rounded-xl" />;
  }

  if (tasks.length === 0) {
    return (
      <div className="rounded-xl border bg-card px-6 py-10 text-center">
        <p className="font-medium">No tasks found</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Tasks assigned to you will show up here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="min-w-56">Title</TableHead>
            <TableHead className="min-w-40">Project</TableHead>
            <TableHead className="min-w-32">Status</TableHead>
            <TableHead className="min-w-28">Priority</TableHead>
            <TableHead className="min-w-32">Assignee</TableHead>
            <TableHead className="min-w-32">Due date</TableHead>
            <TableHead className="min-w-40">Labels</TableHead>
            {onEdit && <TableHead className="min-w-20">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell>
                <button
                  type="button"
                  onClick={() => onSelect(task)}
                  className="text-left font-medium underline-offset-4 hover:underline"
                >
                  {task.title}
                </button>
              </TableCell>
              <TableCell>
                <span className="truncate text-sm text-muted-foreground">
                  {task.project?.name ?? "—"}
                </span>
              </TableCell>
              <TableCell>
                <TaskStatusBadge status={task.status} />
              </TableCell>
              <TableCell>
                <TaskPriorityBadge priority={task.priority} />
              </TableCell>
              <TableCell>
                {task.assignee ? (
                  <span className="inline-flex items-center gap-2">
                    <Avatar className="size-6">
                      <AvatarImage
                        src={task.assignee.avatar_url ?? ""}
                        alt=""
                      />
                      <AvatarFallback className="text-xs">
                        {getInitials(task.assignee.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate text-sm">
                      {task.assignee.name}
                    </span>
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Unassigned
                  </span>
                )}
              </TableCell>
              <TableCell>{formatDate(task.due_date)}</TableCell>
              <TableCell>
                {task.labels.length > 0 ? (
                  <span className="flex flex-wrap gap-1">
                    {task.labels.map((label) => (
                      <span
                        key={label}
                        className="rounded-md bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
                      >
                        {label}
                      </span>
                    ))}
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground">—</span>
                )}
              </TableCell>
              {onEdit &&
                (role === "PROJECT_MANAGER" ||
                  task.assignee_id === data?.data?.id) && (
                  <TableCell>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(task)}
                    >
                      <IconPencil aria-hidden="true" />
                      Edit
                    </Button>
                  </TableCell>
                )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
