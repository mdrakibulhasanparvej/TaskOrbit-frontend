import type { ContactStatus } from "@/types";

/** Pill badge for a contact message's inbox status (NEW | READ | RESOLVED). */
export default function ContactStatusBadge({
  status,
}: {
  status: ContactStatus;
}) {
  const styles: Record<ContactStatus, string> = {
    NEW: "bg-primary/10 text-primary",
    READ: "bg-amber-500/10 text-amber-600 dark:text-amber-500",
    RESOLVED: "bg-muted text-muted-foreground",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}
    >
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}
