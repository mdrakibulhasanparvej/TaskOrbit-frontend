"use client";

import { IconPlus, IconTrash } from "@tabler/icons-react";
import type { FetchError } from "ofetch";
import { useState } from "react";
import TableSkeleton from "@/components/shared/TableSkeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetProjectMembers, useRemoveProjectMember } from "@/hooks";
import getInitials from "@/utils/getInitials";
import triggerToast from "@/utils/triggerToast";
import InviteMemberDialog from "./InviteMemberDialog";

function formatJoinedDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ProjectMembers({ projectId }: { projectId: string }) {
  const { data, isLoading, isError, refetch } = useGetProjectMembers(projectId);
  const { mutate: removeMember, isPending: isRemoving } =
    useRemoveProjectMember();
  const [inviteOpen, setInviteOpen] = useState(false);

  const members = data?.data ?? [];

  const handleRemove = (memberId: string) => {
    removeMember(
      { projectId, memberId },
      {
        onSuccess: (response) => {
          if (!response.success) {
            triggerToast({
              type: "error",
              title: "Remove member failed",
              description: response.message || "Please try again.",
            });
            return;
          }

          triggerToast({
            type: "success",
            title: "Member removed",
            description: response.message || "The member was removed.",
          });
        },
        onError: (error: FetchError) => {
          triggerToast({
            type: "error",
            title: "Remove member failed",
            description: error.data?.message || "Internal Server Error",
          });
        },
      },
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <p className="text-sm text-muted-foreground">
          {members.length} {members.length === 1 ? "member" : "members"} on this
          project.
        </p>
        <Button type="button" size="sm" onClick={() => setInviteOpen(true)}>
          <IconPlus aria-hidden="true" />
          Invite member
        </Button>
      </div>

      {isLoading ? (
        <TableSkeleton columns={4} rows={4} />
      ) : isError ? (
        <div className="rounded-xl border bg-card px-6 py-12 text-center">
          <p className="font-medium">Couldn&apos;t load members.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Check your connection and try again.
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={() => void refetch()}
          >
            Try again
          </Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="min-w-64">Member</TableHead>
                <TableHead className="min-w-56">Email</TableHead>
                <TableHead className="min-w-32">Joined</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={member.user.avatar_url ?? ""}
                          alt=""
                        />
                        <AvatarFallback>
                          {getInitials(member.user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{member.user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{member.user.email}</TableCell>
                  <TableCell>{formatJoinedDate(member.joined_at)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      disabled={isRemoving}
                      aria-label={`Remove ${member.user.name} from project`}
                      onClick={() => handleRemove(member.id)}
                    >
                      <IconTrash aria-hidden="true" />
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {members.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-32 text-center text-muted-foreground"
                  >
                    No members yet. Invite your teammates to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <InviteMemberDialog
        projectId={projectId}
        open={inviteOpen}
        onOpenChange={setInviteOpen}
      />
    </div>
  );
}
