"use client";

import { IconMailOpened, IconRefresh, IconX } from "@tabler/icons-react";
import Link from "next/link";
import type { FetchError } from "ofetch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAcceptInvitation,
  useDeclineInvitation,
  useGetMyInvitations,
} from "@/hooks";
import type { Invitation, InvitationStatus } from "@/types";
import getInitials from "@/utils/getInitials";
import triggerToast from "@/utils/triggerToast";
import ProjectStatusBadge from "./ProjectStatusBadge";

const INVITATION_STATUS_STYLES: Record<InvitationStatus, string> = {
  PENDING:
    "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  ACCEPTED:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  DECLINED:
    "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400",
  EXPIRED: "border-border bg-muted text-muted-foreground",
};

function InvitationStatusBadge({ status }: { status: InvitationStatus }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${INVITATION_STATUS_STYLES[status]}`}
    >
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}

function formatExpiry(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function InvitationList() {
  const { data, isLoading, isError, refetch } = useGetMyInvitations();
  const { mutate: acceptInvitation, isPending: isAccepting } =
    useAcceptInvitation();
  const { mutate: declineInvitation, isPending: isDeclining } =
    useDeclineInvitation();

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

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <header>
        <h1 className="font-heading text-2xl font-semibold sm:text-3xl">
          My invitations
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Project invitations sent to your email address.
        </p>
      </header>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[
            "invitation-skeleton-1",
            "invitation-skeleton-2",
            "invitation-skeleton-3",
          ].map((id) => (
            <Skeleton key={id} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : isError ? (
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
      ) : invitations.length === 0 ? (
        <div className="rounded-xl border bg-card px-6 py-12 text-center">
          <p className="font-medium">No invitations</p>
          <p className="mt-1 text-sm text-muted-foreground">
            When someone invites you to a project, it will appear here.
          </p>
          <Link href="/project-manager/projects">
            <Button type="button" variant="outline" className="mt-4">
              Browse projects
            </Button>
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {invitations.map((invitation) => {
            const isPendingStatus = invitation.status === "PENDING";
            const isExpired = invitation.status === "EXPIRED";

            return (
              <li
                key={invitation.id}
                className="flex flex-col gap-4 rounded-xl border bg-card p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <Avatar>
                    <AvatarImage
                      src={invitation.invited_by.avatar_url ?? ""}
                      alt=""
                    />
                    <AvatarFallback>
                      {getInitials(invitation.invited_by.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-semibold">
                        {invitation.project.name}
                      </p>
                      <ProjectStatusBadge status={invitation.project.status} />
                      <InvitationStatusBadge status={invitation.status} />
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Invited by {invitation.invited_by.name} (
                      {invitation.invited_by.email}) · Expires{" "}
                      {formatExpiry(invitation.expires_at)}
                    </p>
                  </div>
                </div>

                {isPendingStatus && (
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
                )}
                {isExpired && (
                  <p className="shrink-0 text-sm text-muted-foreground">
                    This invitation has expired.
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
