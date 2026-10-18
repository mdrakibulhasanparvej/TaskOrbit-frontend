"use client";

import {
  IconAt,
  IconBell,
  IconClock,
  IconCreditCard,
  IconMail,
  IconMessage,
  IconRefresh,
  IconUserPlus,
} from "@tabler/icons-react";
import type { FetchError } from "ofetch";
import { Button } from "@/components/ui/button";
import { useMarkNotificationRead } from "@/hooks";
import { cn } from "@/lib/utils";
import type { Notification, NotificationType } from "@/types";
import triggerToast from "@/utils/triggerToast";

const MAX_ACTOR_NOTE = 40;

function formatWhen(value: string) {
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

const NOTIFICATION_ICONS: Record<NotificationType, typeof IconBell> = {
  TASK_ASSIGNED: IconUserPlus,
  TASK_STATUS_CHANGED: IconRefresh,
  COMMENT_ADDED: IconMessage,
  MENTION: IconAt,
  DEADLINE_APPROACHING: IconClock,
  INVITE_RECEIVED: IconMail,
  PAYMENT_SUCCESS: IconCreditCard,
};

export default function NotificationItem({
  notification,
}: {
  notification: Notification;
}) {
  const { mutate: markRead, isPending } = useMarkNotificationRead();
  const Icon = NOTIFICATION_ICONS[notification.type] ?? IconBell;
  const actor =
    notification.actor_name && notification.actor_name.length > MAX_ACTOR_NOTE
      ? `${notification.actor_name.slice(0, MAX_ACTOR_NOTE)}…`
      : notification.actor_name;

  const handleMarkRead = () => {
    markRead(notification.id, {
      onSuccess: (response) => {
        if (!response.success) {
          triggerToast({
            type: "error",
            title: "Couldn't mark as read",
            description: response.message || "Please try again.",
          });
        }
      },
      onError: (error: FetchError) => {
        triggerToast({
          type: "error",
          title: "Couldn't mark as read",
          description: error.data?.message || "Internal Server Error",
        });
      },
    });
  };

  return (
    <article
      className={cn(
        "flex items-start gap-3 rounded-xl border px-4 py-3",
        notification.is_read ? "bg-card" : "border-primary/30 bg-accent/40",
      )}
    >
      <span
        className={cn(
          "mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full",
          notification.is_read
            ? "bg-muted text-muted-foreground"
            : "bg-primary/10 text-primary",
        )}
      >
        <Icon aria-hidden="true" className="size-4" />
      </span>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium wrap-break-word">
            {notification.title}
          </span>
          {!notification.is_read && (
            <span className="size-2 shrink-0 rounded-full bg-primary">
              <span className="sr-only">Unread</span>
            </span>
          )}
        </div>

        <p className="text-sm text-muted-foreground wrap-break-word">
          {notification.message}
        </p>

        <span className="text-xs text-muted-foreground">
          {formatWhen(notification.created_at)}
          {actor ? ` · ${actor}` : ""}
        </span>
      </div>

      {!notification.is_read && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={isPending}
          onClick={handleMarkRead}
        >
          Mark read
        </Button>
      )}
    </article>
  );
}
