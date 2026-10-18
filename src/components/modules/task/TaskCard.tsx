"use client";

import { IconMessage } from "@tabler/icons-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetProfile } from "@/hooks";
import type { TaskListItem, TaskOrbitRole } from "@/types";
import getInitials from "@/utils/getInitials";
import TaskPriorityBadge from "./TaskPriorityBadge";

const MAX_VISIBLE_LABELS = 3;

function isOverdue(task: TaskListItem) {
  if (!task.due_date || task.status === "DONE") return false;
  return new Date(task.due_date).getTime() < Date.now();
}

function formatDueDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export default function TaskCard({
  task,
  onSelect,
}: {
  task: TaskListItem;
  onSelect: (task: TaskListItem) => void;
}) {
  const { data } = useGetProfile();
  // Phase-03 profile is typed with the legacy `Role` union; the runtime
  // value is always a TaskOrbit role (same assumption as RoleGuard, D5).
  const role = data?.data?.role as TaskOrbitRole | undefined;
  const overdue = isOverdue(task);

  return (
    <article className="rounded-lg border bg-card p-3 shadow-xs transition-colors hover:bg-accent/40">
      <button
        type="button"
        onClick={() => onSelect(task)}
        className="flex w-full flex-col gap-2 text-left"
      >
        <span className="text-sm font-medium leading-snug wrap-break-word">
          {task.title}
        </span>
        <span className="flex flex-wrap items-center gap-1.5">
          <TaskPriorityBadge priority={task.priority} />
          {task.due_date && (
            <span
              className={
                overdue
                  ? "inline-flex items-center gap-1 text-xs font-medium text-rose-600 dark:text-rose-400"
                  : "inline-flex items-center gap-1 text-xs text-muted-foreground"
              }
            >
              {formatDueDate(task.due_date)}
              {overdue ? " · overdue" : ""}
            </span>
          )}
          {task._count.comments > 0 && (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <IconMessage aria-hidden="true" className="size-3.5" />
              {task._count.comments}
            </span>
          )}
        </span>
      </button>

      {task.labels.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {task.labels.slice(0, MAX_VISIBLE_LABELS).map((label) => (
            <span
              key={label}
              className="rounded-md bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
            >
              {label}
            </span>
          ))}
          {task.labels.length > MAX_VISIBLE_LABELS && (
            <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
              +{task.labels.length - MAX_VISIBLE_LABELS}
            </span>
          )}
        </div>
      )}

      <div className="mt-3 flex items-center justify-between gap-2 border-t pt-2">
        {task.assignee ? (
          <span className="inline-flex min-w-0 items-center gap-2">
            <Avatar className="size-6">
              <AvatarImage src={task.assignee.avatar_url ?? ""} alt="" />
              <AvatarFallback className="text-xs">
                {getInitials(task.assignee.name)}
              </AvatarFallback>
            </Avatar>
            <span className="truncate text-xs text-muted-foreground">
              {task.assignee.name}
            </span>
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">Unassigned</span>
        )}

        {role === "TEAM_MEMBER" && (
          <Link
            href={`/team-member/my-tasks?projectId=${task.project_id}`}
            className="shrink-0 text-xs font-medium text-primary underline-offset-4 hover:underline"
          >
            My tasks in this project
          </Link>
        )}
      </div>
    </article>
  );
}
