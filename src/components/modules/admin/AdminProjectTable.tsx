"use client";

import { IconRefresh, IconSearch, IconTrash } from "@tabler/icons-react";
import type { FetchError } from "ofetch";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDeleteAdminProject, useGetAdminProjects } from "@/hooks";
import type { AdminProject, ProjectStatus, Query } from "@/types";
import { PROJECT_STATUSES } from "@/types";
import triggerToast from "@/utils/triggerToast";

const PAGE_LIMIT = 10;
const ALL = "ALL";

const statusLabel = (value: ProjectStatus) =>
  value.charAt(0) + value.slice(1).toLowerCase().replace("_", " ");

/**
 * Admin project oversight (plan.md §9 — GET /admin/projects +
 * DELETE /admin/projects/:id). Deletion is audited on the backend and asks
 * for confirmation first.
 */
export default function AdminProjectTable() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ProjectStatus | undefined>(undefined);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const { mutate: deleteProject, isPending: isDeleting } =
    useDeleteAdminProject();

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const query = useMemo<Query>(
    () => ({
      page,
      limit: PAGE_LIMIT,
      search: search || undefined,
      status,
    }),
    [page, search, status],
  );

  const { data, isLoading, isError, refetch } = useGetAdminProjects(query);
  const projects = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;

  const handleDelete = (project: AdminProject) => {
    if (isDeleting) return;

    deleteProject(project.id, {
      onSuccess: (response) => {
        if (!response.success) {
          triggerToast({
            type: "error",
            title: "Delete failed",
            description: response.message || "Please try again.",
          });
          return;
        }

        triggerToast({
          type: "success",
          title: "Project deleted",
          description: `${project.name} has been removed.`,
        });
        setConfirmDeleteId(null);
      },
      onError: (error: FetchError) => {
        triggerToast({
          type: "error",
          title: "Delete failed",
          description: error.data?.message || "Internal Server Error",
        });
      },
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-xs">
          <IconSearch
            aria-hidden
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
          value={status ?? ALL}
          onValueChange={(value) => {
            setStatus(value === ALL ? undefined : (value as ProjectStatus));
            setPage(1);
          }}
        >
          <SelectTrigger
            className="w-full sm:w-48"
            aria-label="Filter by status"
          >
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All statuses</SelectItem>
            {PROJECT_STATUSES.map((value) => (
              <SelectItem key={value} value={value}>
                {statusLabel(value)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from(
            { length: 5 },
            (_, index) => `admin-project-skeleton-${index}`,
          ).map((key) => (
            <div key={key} className="h-14 animate-pulse rounded-lg bg-muted" />
          ))}
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
            <IconRefresh aria-hidden />
            Try again
          </Button>
        </div>
      ) : projects.length === 0 ? (
        <div className="rounded-xl border bg-card px-6 py-12 text-center">
          <p className="font-medium">No projects found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your search or status filter.
          </p>
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Tasks</TableHead>
                <TableHead className="text-right">Members</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <div className="flex max-w-64 flex-col">
                      <span className="truncate font-medium">
                        {project.name}
                      </span>
                      {project.description && (
                        <span className="truncate text-xs text-muted-foreground">
                          {project.description}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {project.owner.name}
                  </TableCell>
                  <TableCell>{statusLabel(project.status)}</TableCell>
                  <TableCell className="text-right">
                    {project._count.tasks}
                  </TableCell>
                  <TableCell className="text-right">
                    {project._count.members}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(project.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      {confirmDeleteId === project.id ? (
                        <div className="flex gap-1.5">
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            disabled={isDeleting}
                            onClick={() => handleDelete(project)}
                          >
                            Confirm
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={isDeleting}
                            onClick={() => setConfirmDeleteId(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon-sm"
                          aria-label={`Delete ${project.name}`}
                          onClick={() => setConfirmDeleteId(project.id)}
                        >
                          <IconTrash aria-hidden />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <MyPagination
            page={page}
            totalPages={totalPages}
            handlePageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
