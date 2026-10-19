"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type * as React from "react";
import Logo from "@/components/shared/Logo";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  useGetMyInvitations,
  useGetProfileSuspense,
  useGetUnreadContactCount,
  useGetUnreadCount,
} from "@/hooks";
import { adminRoutes } from "@/routes/admin.routes";
import { clientRoutes } from "@/routes/client.routes";
import { projectManagerRoutes } from "@/routes/project-manager.routes";
import { teamMemberRoutes } from "@/routes/team-member.routes";
import type { TaskOrbitRole } from "@/types";
import DashboardFooter from "./DashboardFooter";
import SidebarCountBadge from "./SidebarCountBadge";

export function DashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { data } = useGetProfileSuspense();
  // profile.role still carries the legacy union TYPE until the cleanup phase
  // retires it (§4 D5, §11.1) — same cast as AuthGuard. Read it before the
  // guard so role-gated queries can opt out without breaking the Rules of Hooks.
  const role = (data?.data?.role as TaskOrbitRole | null) ?? null;
  const { data: unreadData } = useGetUnreadCount();
  const { data: invitationsData } = useGetMyInvitations();
  const { data: unreadContactData } = useGetUnreadContactCount(
    role === "ADMIN",
  );

  const profile = data?.data;

  if (!profile) {
    throw new Error("Profile response did not include user data.");
  }

  const unreadCount = unreadData?.data?.unreadCount ?? 0;
  const invitationCount = invitationsData?.data?.length ?? 0;
  const unreadContactCount = unreadContactData ?? 0;

  // Nav source swap (Phase 03, plan.md §4): TaskOrbit roles only.
  const routes =
    role === "ADMIN"
      ? adminRoutes
      : role === "PROJECT_MANAGER"
        ? projectManagerRoutes
        : role === "TEAM_MEMBER"
          ? teamMemberRoutes
          : role === "CLIENT"
            ? clientRoutes
            : [];

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="data-[slot=sidebar-menu-button]:p-1.5!">
              <a href="/">
                <Logo />
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {routes.map((r) => {
          return (
            <SidebarGroup key={`${r.title}`}>
              <SidebarGroupLabel>{r.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                {r.items.map((i) => {
                  const isActive = pathname === i.url;
                  const isNotifications = i.url.endsWith("/notifications");
                  const isInvitations = i.url.endsWith("/invitations");
                  const isContact = i.url.endsWith("/contact");
                  return (
                    <SidebarMenu key={`${i.title}-${i.url}`}>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          className="mb-1"
                          render={<Link href={i.url} />}
                          isActive={isActive}
                        >
                          <i.icon />
                          {i.title}
                        </SidebarMenuButton>
                        {isNotifications && (
                          <SidebarCountBadge count={unreadCount} />
                        )}
                        {role === "TEAM_MEMBER" && isInvitations && (
                          <SidebarCountBadge count={invitationCount} />
                        )}
                        {role === "ADMIN" && isContact && (
                          <SidebarCountBadge count={unreadContactCount} />
                        )}
                      </SidebarMenuItem>
                    </SidebarMenu>
                  );
                })}
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>
      <DashboardFooter profile={profile} />
    </Sidebar>
  );
}
