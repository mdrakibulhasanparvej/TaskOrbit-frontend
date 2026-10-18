import {
  IconBell,
  IconChartBar,
  IconCreditCard,
  IconFolder,
  IconMessage,
  IconReport,
  IconSettings,
  IconUser,
  IconUsers,
} from "@tabler/icons-react";
import type { Route } from "@/types";

const prefix = "/admin";

export const adminRoutes: Route[] = [
  {
    title: "Profile",
    items: [
      {
        title: "Profile",
        url: `${prefix}`,
        icon: IconUser,
      },
    ],
  },
  {
    title: "Platform",
    items: [
      {
        title: "Overview",
        url: `${prefix}/overview`,
        icon: IconChartBar,
      },
      {
        title: "Notifications",
        url: `${prefix}/notifications`,
        icon: IconBell,
      },
      // Phase 08 admin domain (plan.md §10 step 17).
      {
        title: "Users",
        url: `${prefix}/users`,
        icon: IconUsers,
      },
      {
        title: "Projects",
        url: `${prefix}/projects`,
        icon: IconFolder,
      },
      {
        title: "Payments",
        url: `${prefix}/payments`,
        icon: IconCreditCard,
      },
      {
        title: "Reports",
        url: `${prefix}/reports`,
        icon: IconReport,
      },
      {
        title: "Settings",
        url: `${prefix}/settings`,
        icon: IconSettings,
      },
      {
        title: "Contact",
        url: `${prefix}/contact`,
        icon: IconMessage,
      },
    ],
  },
];
