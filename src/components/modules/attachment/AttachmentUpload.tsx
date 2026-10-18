"use client";

import { IconUpload } from "@tabler/icons-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useUploadAttachments } from "@/hooks";
import triggerToast from "@/utils/triggerToast";
import showAttachmentUploadError from "./AttachmentUpgradeToast";

// Mirrors the backend limits (attachment.service.ts / route `upload.array("files", 5)`).
const MAX_FILES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function AttachmentUpload({ taskId }: { taskId: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate: uploadAttachments, isPending } = useUploadAttachments();

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    const files = Array.from(fileList);

    if (files.length > MAX_FILES) {
      triggerToast({
        type: "error",
        title: "Too many files",
        description: `You can upload up to ${MAX_FILES} files at a time.`,
      });
      return;
    }

    const oversized = files.find((file) => file.size > MAX_FILE_SIZE);

    if (oversized) {
      triggerToast({
        type: "error",
        title: "File too large",
        description: `${oversized.name} is larger than 10MB.`,
      });
      return;
    }

    uploadAttachments(
      { taskId, payload: { files } },
      {
        onSuccess: (response) => {
          if (!response.success) {
            triggerToast({
              type: "error",
              title: "Upload failed",
              description: response.message || "Please try again.",
            });
            return;
          }

          triggerToast({
            type: "success",
            title: "Upload complete",
            description: response.message || "Your files were uploaded.",
          });
        },
        onError: showAttachmentUploadError,
      },
    );

    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        multiple
        aria-label="Choose attachment files"
        className="hidden"
        onChange={(event) => handleFiles(event.target.files)}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isPending}
        onClick={() => inputRef.current?.click()}
      >
        {isPending ? <Spinner /> : <IconUpload aria-hidden="true" />}
        {isPending ? "Uploading..." : "Upload"}
      </Button>
    </>
  );
}
