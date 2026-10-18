import { IconBell, IconFolder, IconMail, IconUser } from "@tabler/icons-react";
import type { Route } from "@/types";

const prefix = "/project-manager";

export const projectManagerRoutes: Route[] = [
  {
    title: "Projects",
    items: [
      {
        title: "Projects",
        url: `${prefix}/projects`,
        icon: IconFolder,
      },
      {
        title: "Invitations",
        url: `${prefix}/invitations`,
        icon: IconMail,
      },
    ],
  },
  {
    title: "Notifications",
    items: [
      {
        title: "Notifications",
        url: `${prefix}/notifications`,
        icon: IconBell,
      },
    ],
  },
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
  // Future nav items (uncomment as pages land — `Route` items are always
  // clickable, so nothing is listed before its page exists):
  // - Phase 06: project board (lives inside the project detail page)
  // - Phase 08: Payments / subscription (PM-only, plan.md §12 risk 2)
];
