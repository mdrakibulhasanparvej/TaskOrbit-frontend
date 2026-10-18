import {
  IconCalendarEvent,
  IconChecklist,
  IconUsers,
} from "@tabler/icons-react";
import Link from "next/link";
import type { Project } from "@/types";
import ProjectStatusBadge from "./ProjectStatusBadge";

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/project-manager/projects/${project.id}`}
      className="group flex flex-col rounded-xl border bg-card p-5 outline-none transition-colors hover:border-primary/40 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold leading-tight group-hover:text-primary">
          {project.name}
        </h3>
        <ProjectStatusBadge status={project.status} />
      </div>

      {project.description && (
        <p className="mt-2 line-clamp-2 text-sm wrap-break-word text-muted-foreground">
          {project.description}
        </p>
      )}

      <p className="mt-3 truncate text-sm text-muted-foreground">
        Owner:{" "}
        <span className="font-medium text-foreground">
          {project.owner.name}
        </span>
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-t pt-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <IconChecklist aria-hidden="true" className="size-3.5" />
          {project._count.tasks} tasks
        </span>
        <span className="inline-flex items-center gap-1">
          <IconUsers aria-hidden="true" className="size-3.5" />
          {project._count.members} members
        </span>
        <span className="inline-flex items-center gap-1">
          <IconCalendarEvent aria-hidden="true" className="size-3.5" />
          {formatDate(project.start_date)} – {formatDate(project.end_date)}
        </span>
      </div>
    </Link>
  );
}
