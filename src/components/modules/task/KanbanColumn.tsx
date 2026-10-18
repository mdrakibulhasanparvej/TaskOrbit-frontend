"use client";

import type { TaskListItem, TaskStatus } from "@/types";
import TaskCard from "./TaskCard";
import TaskStatusBadge from "./TaskStatusBadge";

export default function KanbanColumn({
  status,
  tasks,
  onSelect,
}: {
  status: TaskStatus;
  tasks: TaskListItem[];
  onSelect: (task: TaskListItem) => void;
}) {
  return (
    <section className="flex min-w-0 flex-col rounded-xl border bg-muted/20">
      <header className="flex items-center justify-between gap-2 border-b bg-muted/40 px-3 py-2.5">
        <TaskStatusBadge status={status} />
        <span className="rounded-full bg-background px-2 py-0.5 text-xs font-medium text-muted-foreground">
          {tasks.length}
        </span>
      </header>

      <div className="flex flex-1 flex-col gap-3 p-3">
        {tasks.length === 0 ? (
          <p className="rounded-lg border border-dashed px-3 py-6 text-center text-xs text-muted-foreground">
            No tasks
          </p>
        ) : (
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} onSelect={onSelect} />
          ))
        )}
      </div>
    </section>
  );
}
