"use client";

import type { FetchError } from "ofetch";
import triggerToast from "@/utils/triggerToast";

// The backend returns 403 with "File attachments require a Pro or Business
// plan" when the project owner is on the FREE plan. Match that case so the
// user sees an upgrade prompt instead of a raw error (plan.md risk #10, C11).
const FREE_PLAN_PATTERN = /plan|upgrade|attachment/i;

/**
 * Maps an attachment-upload failure to the right toast: a FREE-plan 403
 * becomes an info-level upgrade prompt, everything else a plain error toast.
 */
export default function showAttachmentUploadError(error: FetchError) {
  const message = error.data?.message ?? "";

  if (error.status === 403 && FREE_PLAN_PATTERN.test(message)) {
    triggerToast({
      type: "info",
      title: "Upgrade to PRO to upload attachments",
      description: message || "File attachments require a paid plan.",
    });
    return;
  }

  triggerToast({
    type: "error",
    title: "Upload failed",
    description: message || "Internal Server Error",
  });
}
