import type { AdminUserStatus } from "@/types";

/** Pill badge for the backend `UserStatus` (ACTIVE | SUSPENDED). */
export default function UserStatusBadge({
  status,
}: {
  status: AdminUserStatus;
}) {
  const isActive = status === "ACTIVE";

  return (
    <span
      className={
        isActive
          ? "inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
          : "inline-flex items-center rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive"
      }
    >
      {isActive ? "Active" : "Suspended"}
    </span>
  );
}
