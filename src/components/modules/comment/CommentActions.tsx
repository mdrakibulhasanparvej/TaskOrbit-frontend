"use client";

import { IconPencil, IconTrash } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

/**
 * Edit/delete affordances for a single comment. Role checks live in the
 * caller (CommentItem) so the same actions render for comments and replies.
 */
export default function CommentActions({
  canEdit,
  canDelete,
  isPending,
  onEdit,
  onDelete,
}: {
  canEdit: boolean;
  canDelete: boolean;
  isPending: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  if (!canEdit && !canDelete) return null;

  return (
    <>
      {canEdit && (
        <Button
          type="button"
          variant="ghost"
          size="xs"
          disabled={isPending}
          onClick={onEdit}
        >
          <IconPencil aria-hidden="true" />
          Edit
        </Button>
      )}
      {canDelete && (
        <Button
          type="button"
          variant="ghost"
          size="xs"
          disabled={isPending}
          onClick={onDelete}
          className="text-destructive hover:text-destructive"
        >
          <IconTrash aria-hidden="true" />
          Delete
        </Button>
      )}
    </>
  );
}
