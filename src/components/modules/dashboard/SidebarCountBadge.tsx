"use client";

import { cn } from "cn";
import { SidebarMenuBadge } from "@/components/ui/sidebar";

interface SidebarCountBadgeProps {
  /** Number to display. Renders nothing when the count is <= 0. */
  count: number;
  /** Counts above this render as `{max}+`. Defaults to 99. */
  max?: number;
  className?: string;
}

/**
 * Reusable red count pill for sidebar nav items (notifications, invitations, …).
 * Must be rendered as a sibling of `SidebarMenuButton` inside a `SidebarMenuItem`
 * so it lands in the item's top-right corner.
 */
export default function SidebarCountBadge({
  count,
  max = 99,
  className,
}: SidebarCountBadgeProps) {
  if (count <= 0) return null;

  return (
    <SidebarMenuBadge
      className={cn(
        "bg-red-500/15 font-medium text-red-600 dark:bg-red-500/20 dark:text-red-400",
        className,
      )}
    >
      {count > max ? `${max}+` : count}
    </SidebarMenuBadge>
  );
}
