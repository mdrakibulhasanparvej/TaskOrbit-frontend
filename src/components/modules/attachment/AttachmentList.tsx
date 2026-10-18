"use client";

import { IconPaperclip } from "@tabler/icons-react";
import type { FetchError } from "ofetch";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeleteAttachment, useGetAttachments, useGetProfile } from "@/hooks";
import type { TaskOrbitRole } from "@/types";
import triggerToast from "@/utils/triggerToast";
import AttachmentItem from "./AttachmentItem";
import AttachmentUpload from "./AttachmentUpload";

/**
 * Task attachment list — upload, download and delete. Upload/delete are
 * PM + TM on the backend (ADMIN is blocked), so the controls are hidden for
 * anyone else.
 */
export default function AttachmentList({ taskId }: { taskId: string }) {
  const { data, isLoading, isError, refetch } = useGetAttachments(taskId);
  const { data: profileData } = useGetProfile();
  // Phase-03 profile is typed with the legacy `Role` union; the runtime value
  // is always a TaskOrbit role (same assumption as RoleGuard, D5).
  const role = profileData?.data?.role as TaskOrbitRole | undefined;
  const { mutate: deleteAttachment, isPending: isDeleting } =
    useDeleteAttachment();

  const attachments = data?.data ?? [];
  const canManage = role === "PROJECT_MANAGER" || role === "TEAM_MEMBER";

  const handleDelete = (attachmentId: string) => {
    deleteAttachment(
      { attachmentId, taskId },
      {
        onSuccess: (response) => {
          if (!response.success) {
            triggerToast({
              type: "error",
              title: "Delete failed",
              description: response.message || "Please try again.",
            });
            return;
          }

          triggerToast({
            type: "success",
            title: "Attachment deleted",
            description: response.message || "The file was deleted.",
          });
        },
        onError: (error: FetchError) => {
          triggerToast({
            type: "error",
            title: "Delete failed",
            description: error.data?.message || "Internal Server Error",
          });
        },
      },
    );
  };

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-1.5 text-sm font-semibold">
          <IconPaperclip aria-hidden="true" className="size-4" />
          Attachments{attachments.length > 0 ? ` (${attachments.length})` : ""}
        </h3>
        {canManage && <AttachmentUpload taskId={taskId} />}
      </div>

      {isLoading && (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-12 rounded-lg" />
          <Skeleton className="h-12 rounded-lg" />
        </div>
      )}

      {isError && (
        <div className="rounded-lg border border-dashed px-4 py-6 text-center text-sm">
          <p className="font-medium">Couldn&apos;t load attachments.</p>
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

      {!isLoading && !isError && attachments.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No attachments yet. Upload plans, screenshots or documents.
        </p>
      )}

      {!isLoading && !isError && attachments.length > 0 && (
        <ul className="flex flex-col gap-2">
          {attachments.map((attachment) => (
            <AttachmentItem
              key={attachment.id}
              attachment={attachment}
              canDelete={canManage}
              isDeleting={isDeleting}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
