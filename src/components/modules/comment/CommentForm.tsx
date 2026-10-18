"use client";

import type { FetchError } from "ofetch";
import type { FormEvent } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useCreateComment } from "@/hooks";
import triggerToast from "@/utils/triggerToast";

const COMMENT_MAX_LENGTH = 5000;

/**
 * Comment composer — used for both new top-level comments (no `parentId`)
 * and one-level replies (`parentId` = the top-level comment id).
 */
export default function CommentForm({
  taskId,
  parentId,
  placeholder = "Write a comment...",
  submitLabel = "Comment",
  onDone,
}: {
  taskId: string;
  parentId?: string;
  placeholder?: string;
  submitLabel?: string;
  onDone?: () => void;
}) {
  const [body, setBody] = useState("");
  const { mutate: createComment, isPending } = useCreateComment();
  const trimmed = body.trim();
  const isTooLong = trimmed.length > COMMENT_MAX_LENGTH;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!trimmed || isTooLong || isPending) return;

    createComment(
      { taskId, payload: { body: trimmed, parent_id: parentId ?? null } },
      {
        onSuccess: (response) => {
          if (!response.success) {
            triggerToast({
              type: "error",
              title: "Comment failed",
              description: response.message || "Please try again.",
            });
            return;
          }

          setBody("");
          onDone?.();
        },
        onError: (error: FetchError) => {
          triggerToast({
            type: "error",
            title: "Comment failed",
            description: error.data?.message || "Internal Server Error",
          });
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <Textarea
        value={body}
        onChange={(event) => setBody(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        rows={3}
        disabled={isPending}
      />
      <div className="flex items-center justify-between gap-2">
        <span
          className={
            isTooLong
              ? "text-xs text-destructive"
              : "text-xs text-muted-foreground"
          }
        >
          {trimmed.length}/{COMMENT_MAX_LENGTH}
        </span>
        <div className="flex items-center gap-2">
          {onDone && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isPending}
              onClick={onDone}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            size="sm"
            disabled={isPending || trimmed.length === 0 || isTooLong}
          >
            {isPending && <Spinner />}
            {submitLabel}
          </Button>
        </div>
      </div>
    </form>
  );
}
