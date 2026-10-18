"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetComments, useGetProfile } from "@/hooks";
import type { TaskOrbitRole } from "@/types";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

/**
 * Task comment thread — a composer plus the list of top-level comments, each
 * of which renders its own one-level replies.
 */
export default function CommentThread({ taskId }: { taskId: string }) {
  const { data, isLoading, isError, refetch } = useGetComments(taskId);
  const { data: profileData } = useGetProfile();
  // Phase-03 profile is typed with the legacy `Role` union; the runtime value
  // is always a TaskOrbit role (same assumption as RoleGuard, D5).
  const currentUserId = profileData?.data?.id;
  const role = profileData?.data?.role as TaskOrbitRole | undefined;
  const comments = data?.comments ?? [];

  return (
    <section className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold">
        Comments{comments.length > 0 ? ` (${comments.length})` : ""}
      </h3>

      <CommentForm taskId={taskId} />

      <Separator />

      {isLoading && (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-16 rounded-lg" />
          <Skeleton className="h-16 rounded-lg" />
        </div>
      )}

      {isError && (
        <div className="rounded-lg border border-dashed px-4 py-6 text-center text-sm">
          <p className="font-medium">Couldn&apos;t load comments.</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => void refetch()}
          >
            Try again
          </Button>
        </div>
      )}

      {!isLoading && !isError && comments.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No comments yet. Start the conversation.
        </p>
      )}

      {!isLoading && !isError && comments.length > 0 && (
        <ul className="flex flex-col gap-5">
          {comments.map((comment) => (
            <li key={comment.id}>
              <CommentItem
                comment={comment}
                taskId={taskId}
                currentUserId={currentUserId}
                role={role}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
