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
import { useGetProfileSuspense } from "@/hooks";
import { adminRoutes } from "@/routes/admin.routes";
import { projectManagerRoutes } from "@/routes/project-manager.routes";
import { teamMemberRoutes } from "@/routes/team-member.routes";
import type { TaskOrbitRole } from "@/types";
import DashboardFooter from "./DashboardFooter";

export function DashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { data } = useGetProfileSuspense();

  const profile = data?.data;

  if (!profile) {
    throw new Error("Profile response did not include user data.");
  }

  // Nav source swap (Phase 03, plan.md §4): TaskOrbit roles only.
  // profile.role still carries the legacy union TYPE until the cleanup phase
  // retires it (§4 D5, §11.1) — same cast as AuthGuard.
  const role = profile.role as TaskOrbitRole | null;
  const routes =
    role === "ADMIN"
      ? adminRoutes
      : role === "PROJECT_MANAGER"
        ? projectManagerRoutes
        : role === "TEAM_MEMBER"
          ? teamMemberRoutes
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
