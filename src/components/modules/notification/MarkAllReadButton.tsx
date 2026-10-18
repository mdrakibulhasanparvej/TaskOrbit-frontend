"use client";

import { IconChecks } from "@tabler/icons-react";
import type { FetchError } from "ofetch";
import { Button } from "@/components/ui/button";
import { useGetUnreadCount, useMarkAllNotificationsRead } from "@/hooks";
import triggerToast from "@/utils/triggerToast";

export default function MarkAllReadButton() {
  const { data } = useGetUnreadCount();
  const { mutate: markAllRead, isPending } = useMarkAllNotificationsRead();
  const unreadCount = data?.data?.unreadCount ?? 0;

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={isPending || unreadCount === 0}
      onClick={() =>
        markAllRead(undefined, {
          onSuccess: (response) => {
            if (!response.success) {
              triggerToast({
                type: "error",
                title: "Couldn't mark all as read",
                description: response.message || "Please try again.",
              });
              return;
            }

            triggerToast({
              type: "success",
              title: "All caught up",
              description: response.message || "All notifications are read.",
            });
          },
          onError: (error: FetchError) => {
            triggerToast({
              type: "error",
              title: "Couldn't mark all as read",
              description: error.data?.message || "Internal Server Error",
            });
          },
        })
      }
    >
      <IconChecks aria-hidden="true" />
      Mark all as read
    </Button>
  );
}
