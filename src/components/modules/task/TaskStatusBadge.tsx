import type { TaskStatus } from "@/types";

const TASK_STATUS_STYLES: Record<TaskStatus, string> = {
  TODO: "border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400",
  IN_PROGRESS:
    "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  IN_REVIEW:
    "border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-400",
  DONE: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
};

/** `IN_PROGRESS` → "In progress" (shared by selects/columns). */
export function statusLabel(status: TaskStatus) {
  return status.charAt(0) + status.slice(1).toLowerCase().replace("_", " ");
}

export default function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${TASK_STATUS_STYLES[status]}`}
    >
      {statusLabel(status)}
    </span>
  );
}
