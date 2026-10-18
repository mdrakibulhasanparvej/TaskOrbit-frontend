"use client";

import {
  IconCalendarEvent,
  IconChecklist,
  IconRefresh,
  IconUsers,
} from "@tabler/icons-react";
import KanbanBoard from "@/components/modules/task/KanbanBoard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetProjectById, useGetProjectInvitations } from "@/hooks";
import type { InvitationStatus } from "@/types";
import getInitials from "@/utils/getInitials";
import ProjectMembers from "./ProjectMembers";
import ProjectStatusBadge from "./ProjectStatusBadge";

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const INVITATION_STATUS_STYLES: Record<InvitationStatus, string> = {
  PENDING:
    "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  ACCEPTED:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  DECLINED:
    "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400",
  EXPIRED: "border-border bg-muted text-muted-foreground",
};

function InvitationRowStatusBadge({ status }: { status: InvitationStatus }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${INVITATION_STATUS_STYLES[status]}`}
    >
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}

function ProjectInvitations({ projectId }: { projectId: string }) {
  const { data, isLoading } = useGetProjectInvitations(projectId);
  const invitations = data?.data ?? [];

  if (isLoading) {
    return <Skeleton className="h-48 rounded-xl" />;
  }

  if (invitations.length === 0) {
    return (
      <div className="rounded-xl border bg-card px-6 py-10 text-center">
        <p className="font-medium">No invitations sent yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Use the Members tab to invite teammates to this project.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="min-w-56">Email</TableHead>
            <TableHead className="min-w-32">Status</TableHead>
            <TableHead className="min-w-32">Expires</TableHead>
            <TableHead className="min-w-48">Invited by</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invitations.map((invitation) => (
            <TableRow key={invitation.id}>
              <TableCell>{invitation.email}</TableCell>
              <TableCell>
                <InvitationRowStatusBadge status={invitation.status} />
              </TableCell>
              <TableCell>{formatDate(invitation.expires_at)}</TableCell>
              <TableCell>{invitation.invited_by.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function ProjectDetails({ projectId }: { projectId: string }) {
  const { data, isLoading, isError, refetch } = useGetProjectById(projectId);
  const project = data?.data;

  if (isLoading) {
    return (
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-96 rounded-xl" />
      </section>
    );
  }

  if (isError || !project) {
    return (
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
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

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <header className="rounded-xl border bg-card p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
          <div className="min-w-0">
            <h1 className="font-heading text-2xl font-semibold sm:text-3xl">
              {project.name}
            </h1>
            {project.description && (
              <p className="mt-2 max-w-3xl text-sm wrap-break-word text-muted-foreground">
                {project.description}
              </p>
            )}
          </div>
          <ProjectStatusBadge status={project.status} />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t pt-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <Avatar className="size-6">
              <AvatarImage src={project.owner.avatar_url ?? ""} alt="" />
              <AvatarFallback className="text-xs">
                {getInitials(project.owner.name)}
              </AvatarFallback>
            </Avatar>
            <span>
              Owner:{" "}
              <span className="font-medium text-foreground">
                {project.owner.name}
              </span>
            </span>
          </span>
          <span className="inline-flex items-center gap-1">
            <IconCalendarEvent aria-hidden="true" className="size-4" />
            {formatDate(project.start_date)} – {formatDate(project.end_date)}
          </span>
          <span className="inline-flex items-center gap-1">
            <IconChecklist aria-hidden="true" className="size-4" />
            {project._count.tasks} tasks
          </span>
          <span className="inline-flex items-center gap-1">
            <IconUsers aria-hidden="true" className="size-4" />
            {project._count.members} members
          </span>
        </div>
      </header>

      <Tabs defaultValue="board" className="w-full min-w-0">
        <TabsList className="self-start justify-start">
          <TabsTrigger value="board">Board</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="invitations">Invitations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="w-full min-w-0">
          <div className="rounded-xl border bg-card p-5 sm:p-6">
            <h2 className="font-semibold">About this project</h2>
            <p className="mt-2 text-sm wrap-break-word text-muted-foreground">
              {project.description || "No description provided."}
            </p>

            <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border bg-muted/30 p-4">
                <dt className="text-xs text-muted-foreground">Status</dt>
                <dd className="mt-1">
                  <ProjectStatusBadge status={project.status} />
                </dd>
              </div>
              <div className="rounded-lg border bg-muted/30 p-4">
                <dt className="text-xs text-muted-foreground">Owner</dt>
                <dd className="mt-1 truncate font-medium">
                  {project.owner.name} ({project.owner.email})
                </dd>
              </div>
              <div className="rounded-lg border bg-muted/30 p-4">
                <dt className="text-xs text-muted-foreground">Start date</dt>
                <dd className="mt-1 font-medium">
                  {formatDate(project.start_date)}
                </dd>
              </div>
              <div className="rounded-lg border bg-muted/30 p-4">
                <dt className="text-xs text-muted-foreground">End date</dt>
                <dd className="mt-1 font-medium">
                  {formatDate(project.end_date)}
                </dd>
              </div>
              <div className="rounded-lg border bg-muted/30 p-4">
                <dt className="text-xs text-muted-foreground">Tasks</dt>
                <dd className="mt-1 font-medium">{project._count.tasks}</dd>
              </div>
              <div className="rounded-lg border bg-muted/30 p-4">
                <dt className="text-xs text-muted-foreground">Members</dt>
                <dd className="mt-1 font-medium">{project._count.members}</dd>
              </div>
            </dl>
          </div>
        </TabsContent>

        <TabsContent value="members" className="w-full min-w-0">
          <ProjectMembers projectId={projectId} />
        </TabsContent>

        <TabsContent value="invitations" className="w-full min-w-0">
          <ProjectInvitations projectId={projectId} />
        </TabsContent>

        <TabsContent value="board" className="w-full min-w-0">
          <KanbanBoard projectId={projectId} />
        </TabsContent>
      </Tabs>
    </section>
  );
}
