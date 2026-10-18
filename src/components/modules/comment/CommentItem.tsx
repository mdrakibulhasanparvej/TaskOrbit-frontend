"use client";

import type { FetchError } from "ofetch";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useDeleteComment, useUpdateComment } from "@/hooks";
import type { Comment, CommentReply, TaskOrbitRole } from "@/types";
import getInitials from "@/utils/getInitials";
import triggerToast from "@/utils/triggerToast";
import CommentActions from "./CommentActions";
import CommentForm from "./CommentForm";
import CommentReplies from "./CommentReplies";

function formatDateTime(value: string) {
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

/**
 * A single comment row. `isReply` renders the compact reply variant directly
 * under its parent and suppresses the reply-nesting affordances.
 */
export default function CommentItem({
  comment,
  taskId,
  currentUserId,
  role,
  isReply = false,
}: {
  comment: Comment | CommentReply;
  taskId: string;
  currentUserId: string | undefined;
  role: TaskOrbitRole | undefined;
  isReply?: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [draft, setDraft] = useState(comment.body);
  const { mutate: updateComment, isPending: isUpdating } = useUpdateComment();
  const { mutate: deleteComment, isPending: isDeleting } = useDeleteComment();

  const isAuthor =
    Boolean(currentUserId) && comment.author.id === currentUserId;
  // Editing is author-only (the backend rejects edits by anyone else);
  // deleting is allowed for the author or PM/ADMIN (plan.md §9).
  const canEdit = isAuthor;
  const canDelete = isAuthor || role === "PROJECT_MANAGER" || role === "ADMIN";
  const isPending = isUpdating || isDeleting;
  const replies: CommentReply[] = "replies" in comment ? comment.replies : [];

  const handleUpdate = () => {
    const body = draft.trim();
    if (!body) return;

    updateComment(
      { commentId: comment.id, taskId, body },
      {
        onSuccess: (response) => {
          if (!response.success) {
            triggerToast({
              type: "error",
              title: "Comment update failed",
              description: response.message || "Please try again.",
            });
            return;
          }

          setIsEditing(false);
        },
        onError: (error: FetchError) => {
          triggerToast({
            type: "error",
            title: "Comment update failed",
            description: error.data?.message || "Internal Server Error",
          });
        },
      },
    );
  };

  const handleDelete = () => {
    deleteComment(
      { commentId: comment.id, taskId },
      {
        onSuccess: (response) => {
          if (!response.success) {
            triggerToast({
              type: "error",
              title: "Comment deletion failed",
              description: response.message || "Please try again.",
            });
            return;
          }

          triggerToast({
            type: "success",
            title: "Comment deleted",
            description: response.message || "The comment was deleted.",
          });
        },
        onError: (error: FetchError) => {
          triggerToast({
            type: "error",
            title: "Comment deletion failed",
            description: error.data?.message || "Internal Server Error",
          });
        },
      },
    );
  };

  return (
    <article className={isReply ? "flex gap-2" : "flex gap-3"}>
      <Avatar className={isReply ? "size-6" : "size-8"}>
        <AvatarImage src={comment.author.avatar_url ?? ""} alt="" />
        <AvatarFallback className="text-xs">
          {getInitials(comment.author.name)}
        </AvatarFallback>
      </Avatar>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span className="text-sm font-medium">{comment.author.name}</span>
          <span className="text-xs text-muted-foreground">
            {formatDateTime(comment.created_at)}
          </span>
          {comment.updated_at !== comment.created_at && (
            <span className="text-xs text-muted-foreground">· edited</span>
          )}
        </div>

        {isEditing ? (
          <div className="flex flex-col gap-2">
            <Textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              aria-label="Edit comment"
              rows={3}
              disabled={isPending}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={isPending}
                onClick={() => {
                  setDraft(comment.body);
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={isPending || draft.trim().length === 0}
                onClick={handleUpdate}
              >
                Save
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm wrap-break-word whitespace-pre-wrap">
            {comment.body}
          </p>
        )}

        {!isEditing && (
          <div className="flex flex-wrap items-center gap-1">
            <CommentActions
              canEdit={canEdit}
              canDelete={canDelete}
              isPending={isPending}
              onEdit={() => setIsEditing(true)}
              onDelete={handleDelete}
            />
            {!isReply && (
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={() => setIsReplying((previous) => !previous)}
              >
                Reply
              </Button>
            )}
          </div>
        )}

        {!isReply && replies.length > 0 && (
          <CommentReplies
            replies={replies}
            taskId={taskId}
            currentUserId={currentUserId}
            role={role}
          />
        )}

        {!isReply && isReplying && (
          <div className="mt-1">
            <CommentForm
              taskId={taskId}
              parentId={comment.id}
              placeholder={`Reply to ${comment.author.name}...`}
              submitLabel="Reply"
              onDone={() => setIsReplying(false)}
            />
          </div>
        )}
      </div>
    </article>
  );
}
