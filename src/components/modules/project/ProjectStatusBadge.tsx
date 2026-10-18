import type { ProjectStatus } from "@/types";

const STATUS_STYLES: Record<ProjectStatus, string> = {
  PLANNING: "border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400",
  ACTIVE:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  ON_HOLD:
    "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  COMPLETED:
    "border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-400",
  ARCHIVED: "border-border bg-muted text-muted-foreground",
};

const STATUS_LABELS: Record<ProjectStatus, string> = {
  PLANNING: "Planning",
  ACTIVE: "Active",
  ON_HOLD: "On hold",
  COMPLETED: "Completed",
  ARCHIVED: "Archived",
};

export default function ProjectStatusBadge({
  status,
}: {
  status: ProjectStatus;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
