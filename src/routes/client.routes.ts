import {
  IconBell,
  IconCreditCard,
  IconMail,
  IconReceipt,
  IconUser,
} from "@tabler/icons-react";
import type { Route } from "@/types";

const prefix = "/client";

export const clientRoutes: Route[] = [
  {
    title: "Billing",
    items: [
      {
        title: "Subscription",
        url: `${prefix}/subscription`,
        icon: IconCreditCard,
      },
      {
        title: "Payment History",
        url: `${prefix}/payment-history`,
        icon: IconReceipt,
      },
    ],
  },
  {
    title: "Support",
    items: [
      {
        title: "Contact",
        url: `${prefix}/contact`,
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
];
