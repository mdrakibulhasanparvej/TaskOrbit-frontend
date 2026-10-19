"use client";

import { IconRefresh } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetProjectById } from "@/hooks";
import ProjectForm from "./ProjectForm";

/**
 * Loads a project and hands it to `ProjectForm` in edit mode
 * (renders the `PATCH /projects/:id` flow). Guarded to the PM dashboard.
 */
export default function ProjectEdit({ projectId }: { projectId: string }) {
  const { data, isLoading, isError, refetch } = useGetProjectById(projectId);
  const project = data?.data;

  if (isLoading) {
    return (
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-96 rounded-xl" />
      </section>
    );
  }

  if (isError || !project) {
    return (
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-xl border bg-card px-6 py-12 text-center">
          <p className="font-medium">Couldn&apos;t load this project.</p>
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
      </section>
    );
  }

  return <ProjectForm project={project} />;
}
