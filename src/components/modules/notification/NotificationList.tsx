"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetNotifications, useGetUnreadCount } from "@/hooks";
import MarkAllReadButton from "./MarkAllReadButton";
import NotificationEmpty from "./NotificationEmpty";
import NotificationItem from "./NotificationItem";

export default function NotificationList() {
  const { data, isLoading, isError, refetch } = useGetNotifications({
    limit: 50,
  });
  const { data: unreadData } = useGetUnreadCount();
  const notifications = data?.data ?? [];
  const unreadCount = unreadData?.data?.unreadCount ?? 0;

  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div>
          <h1 className="font-heading text-2xl font-semibold sm:text-3xl">
            Notifications
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}.`
              : "Updates about your tasks, comments and invitations."}
          </p>
        </div>
        <MarkAllReadButton />
      </header>

      {isLoading && (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
        </div>
      )}

      {isError && (
        <div className="rounded-xl border bg-card px-6 py-10 text-center">
          <p className="font-medium">Couldn&apos;t load notifications.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Check your connection and try again.
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={() => void refetch()}
          >
            Try again
          </Button>
        </div>
      )}

      {!isLoading && !isError && notifications.length === 0 && (
        <NotificationEmpty />
      )}

      {!isLoading && !isError && notifications.length > 0 && (
        <ul className="flex flex-col gap-2">
          {notifications.map((notification) => (
            <li key={notification.id}>
              <NotificationItem notification={notification} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
