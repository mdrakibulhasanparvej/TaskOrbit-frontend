"use client";

import { IconRefresh } from "@tabler/icons-react";
import { useState } from "react";
import MyPagination from "@/components/shared/Pagination";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetAdminReports } from "@/hooks";

const PAGE_LIMIT = 10;

/**
 * Admin reports (plan.md §9 — GET /admin/reports): platform totals, the
 * top-5 projects by task count, and the paginated audit trail.
 */
export default function ReportsTable() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = useGetAdminReports({
    page,
    limit: PAGE_LIMIT,
  });

  const report = data?.data;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (isError || !report) {
    return (
      <div className="rounded-xl border bg-card px-6 py-12 text-center">
        <p className="font-medium">Couldn&apos;t load reports.</p>
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
    );
  }

  const { totals, topProjects, auditLogs } = report;
  const logs = auditLogs.data ?? [];
  const totalPages = auditLogs.meta?.totalPages ?? 1;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-normal text-muted-foreground">
              Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{totals.users}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-normal text-muted-foreground">
              Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{totals.projects}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-normal text-muted-foreground">
              Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{totals.tasks}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-normal text-muted-foreground">
              Successful payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{totals.payments}</p>
          </CardContent>
        </Card>
      </div>

      {topProjects.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="font-heading text-lg font-semibold">Top projects</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead className="text-right">Tasks</TableHead>
                <TableHead className="text-right">Members</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {project.owner.name}
                  </TableCell>
                  <TableCell className="text-right">
                    {project._count.tasks}
                  </TableCell>
                  <TableCell className="text-right">
                    {project._count.members}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      )}

      <section className="flex flex-col gap-3">
        <h2 className="font-heading text-lg font-semibold">Audit trail</h2>
        {logs.length === 0 ? (
          <div className="rounded-xl border bg-card px-6 py-10 text-center">
            <p className="font-medium">No audit entries</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Administrative actions will appear here.
            </p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>When</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">{log.action}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {log.actor_name ?? "System"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {log.entity}
                      {log.entity_id ? ` · ${log.entity_id.slice(0, 8)}` : ""}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(log.created_at).toLocaleString()}
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
      </section>
    </div>
  );
}
