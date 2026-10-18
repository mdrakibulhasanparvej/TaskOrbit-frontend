import type { TaskPriority } from "@/types";

const TASK_PRIORITY_STYLES: Record<TaskPriority, string> = {
  LOW: "border-border bg-muted text-muted-foreground",
  MEDIUM: "border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400",
  HIGH: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  URGENT: "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400",
};

/** `URGENT` → "Urgent" (shared by selects). */
export function priorityLabel(priority: TaskPriority) {
  return priority.charAt(0) + priority.slice(1).toLowerCase().replace("_", " ");
}

export default function TaskPriorityBadge({
  priority,
}: {
  priority: TaskPriority;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${TASK_PRIORITY_STYLES[priority]}`}
    >
      {priorityLabel(priority)}
    </span>
  );
}
