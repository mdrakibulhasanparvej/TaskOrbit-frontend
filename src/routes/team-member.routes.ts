import { IconBell, IconListCheck, IconUser } from "@tabler/icons-react";
import type { Route } from "@/types";

const prefix = "/team-member";

export const teamMemberRoutes: Route[] = [
  {
    title: "My Tasks",
    items: [
      {
        title: "My Tasks",
        url: `${prefix}/my-tasks`,
        icon: IconListCheck,
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
];
