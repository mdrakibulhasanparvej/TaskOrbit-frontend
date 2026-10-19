"use client";

import { IconPlus, IconRefresh, IconSearch } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import MyPagination from "@/components/shared/Pagination";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetProjects } from "@/hooks";
import type { ProjectStatus, ProjectsQuery } from "@/types";
import { PROJECT_STATUSES } from "@/types";
import ProjectCard from "./ProjectCard";

const PAGE_LIMIT = 9;

const ALL_STATUSES = "ALL";

export default function ProjectList({
  canCreate = true,
  description = "Create and manage the projects you own.",
}: {
  canCreate?: boolean;
  description?: string;
}) {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ProjectStatus | undefined>(undefined);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const query = useMemo<ProjectsQuery>(
    () => ({
      page,
      limit: PAGE_LIMIT,
      search: search || undefined,
      status,
    }),
    [page, search, status],
  );

  const { data, isLoading, isError, refetch } = useGetProjects(query);
  const projects = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-heading text-2xl font-semibold sm:text-3xl">
            Projects
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        </div>
        {canCreate && (
          <Link href="/project-manager/create-project">
            <Button>
              <IconPlus aria-hidden="true" />
              Create project
            </Button>
          </Link>
        )}
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-xs">
          <IconSearch
            aria-hidden="true"
            className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search projects..."
            aria-label="Search projects"
            className="h-9 w-full rounded-lg border border-input bg-background pr-3 pl-9 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>

        <Select
          items={[
            { value: ALL_STATUSES, label: "All statuses" },
            ...PROJECT_STATUSES.map((value) => ({
              value,
              label:
                value.charAt(0) +
                value.slice(1).toLowerCase().replace("_", " "),
            })),
          ]}
          value={status ?? ALL_STATUSES}
          onValueChange={(value) => {
            if (value === ALL_STATUSES) {
              setStatus(undefined);
              setPage(1);
              return;
            }
            if (
              PROJECT_STATUSES.includes(value as ProjectStatus) &&
              value !== undefined
            ) {
              setStatus(value as ProjectStatus);
              setPage(1);
            }
          }}
        >
          <SelectTrigger
            className="w-full sm:w-48"
            aria-label="Filter by status"
          >
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_STATUSES}>All statuses</SelectItem>
            {PROJECT_STATUSES.map((value) => (
              <SelectItem key={value} value={value}>
                {value.charAt(0) +
                  value.slice(1).toLowerCase().replace("_", " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: PAGE_LIMIT }, (_, index) => index + 1).map(
            (pageNumber) => (
              <Skeleton
                key={`project-skeleton-${pageNumber}`}
                className="h-44 rounded-xl"
              />
            ),
          )}
        </div>
      ) : isError ? (
        <div className="rounded-xl border bg-card px-6 py-12 text-center">
          <p className="font-medium">Couldn&apos;t load projects.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Check your connection and try again.
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
      ) : projects.length === 0 ? (
        <div className="rounded-xl border bg-card px-6 py-12 text-center">
          <p className="font-medium">No projects found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {search || status
              ? "Try adjusting your search or status filter."
              : canCreate
                ? "Create your first project to get started."
                : "You are not a member of any project yet."}
          </p>
          {canCreate && !search && !status && (
            <Link href="/project-manager/create-project">
              <Button type="button" className="mt-4">
                <IconPlus aria-hidden="true" />
                Create project
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
          <MyPagination
            page={page}
            totalPages={totalPages}
            handlePageChange={setPage}
          />
        </>
      )}
    </section>
  );
}
