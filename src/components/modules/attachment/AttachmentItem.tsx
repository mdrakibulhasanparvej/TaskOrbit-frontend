"use client";

import { IconDownload, IconFile, IconTrash } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import type { Attachment } from "@/types";

const SIZE_UNITS = ["KB", "MB", "GB"];

function formatBytes(size: number) {
  if (size < 1024) return `${size} B`;

  let value = size / 1024;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < SIZE_UNITS.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(value >= 10 ? 0 : 1)} ${SIZE_UNITS[unitIndex]}`;
}

export default function AttachmentItem({
  attachment,
  canDelete,
  isDeleting,
  onDelete,
}: {
  attachment: Attachment;
  canDelete: boolean;
  isDeleting: boolean;
  onDelete: (attachmentId: string) => void;
}) {
  return (
    <li className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2">
      <IconFile
        aria-hidden="true"
        className="size-4 shrink-0 text-muted-foreground"
      />

      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-medium">
          {attachment.file_name}
        </span>
        <span className="truncate text-xs text-muted-foreground">
          {formatBytes(attachment.size)}
          {attachment.uploaded_by?.name
            ? ` · ${attachment.uploaded_by.name}`
            : ""}
        </span>
      </span>

      <a
        href={attachment.url}
        target="_blank"
        rel="noreferrer"
        aria-label={`Open ${attachment.file_name}`}
        className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <IconDownload aria-hidden="true" className="size-4" />
      </a>

      {canDelete && (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          disabled={isDeleting}
          aria-label={`Delete ${attachment.file_name}`}
          onClick={() => onDelete(attachment.id)}
          className="text-destructive hover:text-destructive"
        >
          <IconTrash aria-hidden="true" />
        </Button>
      )}
    </li>
  );
}
