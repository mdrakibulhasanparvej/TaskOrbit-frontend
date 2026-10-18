import { IconBellOff } from "@tabler/icons-react";

export default function NotificationEmpty() {
  return (
    <div className="rounded-xl border border-dashed bg-card px-6 py-12 text-center">
      <IconBellOff
        aria-hidden="true"
        className="mx-auto size-8 text-muted-foreground"
      />
      <p className="mt-3 font-medium">You&apos;re all caught up</p>
      <p className="mt-1 text-sm text-muted-foreground">
        New notifications about your tasks, comments and invitations will appear
        here.
      </p>
    </div>
  );
}
