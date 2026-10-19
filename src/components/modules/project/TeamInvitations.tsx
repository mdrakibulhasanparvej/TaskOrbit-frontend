"use client";

import { IconMailOpened, IconRefresh, IconX } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import type { FetchError } from "ofetch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAcceptInvitation,
  useDeclineInvitation,
  useGetMyInvitations,
} from "@/hooks";
import type { Invitation } from "@/types";
import getInitials from "@/utils/getInitials";
import triggerToast from "@/utils/triggerToast";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function TeamInvitations() {
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useGetMyInvitations();
  const { mutate: acceptInvitation, isPending: isAccepting } =
    useAcceptInvitation();
  const { mutate: declineInvitation, isPending: isDeclining } =
    useDeclineInvitation();

  // GET /projects/invitations/mine returns only PENDING, non-expired rows.
  const invitations = data?.data ?? [];
  const isMutating = isAccepting || isDeclining;

  const handleAccept = (invitation: Invitation) => {
    if (!invitation.token) {
      triggerToast({
        type: "error",
        title: "Acceptance failed",
        description: "This invitation has no acceptance token.",
      });
      return;
    }

    acceptInvitation(invitation.token, {
      onSuccess: (response) => {
        if (!response.success) {
          triggerToast({
            type: "error",
            title: "Acceptance failed",
            description: response.message || "Please try again.",
          });
          return;
        }

        triggerToast({
          type: "success",
          title: "Invitation accepted",
          description:
            response.message || `You joined ${invitation.project.name}.`,
        });

        // Land the new member on their task list for the joined project.
        const projectId = response.data?.id;
        router.push(
          projectId
            ? `/team-member/my-tasks?projectId=${projectId}`
            : "/team-member/my-tasks",
        );
      },
      onError: (error: FetchError) => {
        triggerToast({
          type: "error",
          title: "Acceptance failed",
          description: error.data?.message || "Internal Server Error",
        });
      },
    });
  };

  const handleDecline = (invitation: Invitation) => {
    if (!invitation.token) {
      triggerToast({
        type: "error",
        title: "Decline failed",
        description: "This invitation has no acceptance token.",
      });
      return;
    }

    declineInvitation(invitation.token, {
      onSuccess: (response) => {
        if (!response.success) {
          triggerToast({
            type: "error",
            title: "Decline failed",
            description: response.message || "Please try again.",
          });
          return;
        }

        triggerToast({
          type: "success",
          title: "Invitation declined",
          description:
            response.message || `You declined ${invitation.project.name}.`,
        });
      },
      onError: (error: FetchError) => {
        triggerToast({
          type: "error",
          title: "Decline failed",
          description: error.data?.message || "Internal Server Error",
        });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {[
          "invitation-skeleton-1",
          "invitation-skeleton-2",
          "invitation-skeleton-3",
        ].map((id) => (
          <Skeleton key={id} className="h-28 rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border bg-card px-6 py-12 text-center">
        <p className="font-medium">Couldn&apos;t load invitations.</p>
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
    );
  }

  if (invitations.length === 0) {
    return (
      <div className="rounded-xl border bg-card px-6 py-12 text-center">
        <p className="font-medium">No pending invitations</p>
        <p className="mt-1 text-sm text-muted-foreground">
          When someone invites you to a project, it will appear here.
        </p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {invitations.map((invitation) => (
        <li
          key={invitation.id}
          className="flex flex-col gap-4 rounded-xl border bg-card p-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex min-w-0 items-start gap-3">
            <Avatar>
              <AvatarImage src={invitation.invited_by.avatar_url ?? ""} alt="" />
              <AvatarFallback>
                {getInitials(invitation.invited_by.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-semibold">
                {invitation.project.name}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Invited by {invitation.invited_by.name} ·{" "}
                {formatDate(invitation.created_at ?? invitation.expires_at)}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 gap-2">
            <Button
              type="button"
              size="sm"
              disabled={isMutating}
              onClick={() => handleAccept(invitation)}
            >
              <IconMailOpened aria-hidden="true" />
              Accept
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isMutating}
              onClick={() => handleDecline(invitation)}
            >
              <IconX aria-hidden="true" />
              Decline
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
