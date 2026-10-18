import type * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

const demoRoutes = [
  {
    title: "",
    url: "",
    items: [
      {
        title: "",
        url: "",
      },
      {
        title: "",
        url: "",
      },
    ],
  },
  {
    title: "",
    url: "",
    items: [
      {
        title: "",
        url: "",
      },
      {
        title: "",
        url: "",
      },
      {
        title: "",
        url: "",
      },
      {
        title: "",
        url: "",
      },
      {
        title: "",
        url: "",
      },
      {
        title: "",
        url: "",
      },
      {
        title: "",
        url: "",
      },
      {
        title: "",
        url: "",
      },
      {
        title: "",
        url: "",
      },
      {
        title: "",
        url: "",
      },
      {
        title: "",
        url: "",
      },
      {
        title: "",
        url: "",
      },
    ],
  },
];

export default function SidebarSkeleton(
  props: React.ComponentProps<typeof Sidebar>,
) {
  return (
    <Sidebar collapsible="offcanvas" aria-label="Loading sidebar" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              disabled
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Skeleton className="h-7 w-28" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent aria-hidden="true">
        {demoRoutes.map((route) => (
          <SidebarGroup key={route.title}>
            <SidebarGroupLabel>
              <Skeleton className="h-3 w-16" />
            </SidebarGroupLabel>
            <SidebarGroupContent>
              {route.items.map((item) => (
                <SidebarMenu key={item.url}>
                  <SidebarMenuItem>
                    <SidebarMenuButton disabled>
                      <Skeleton className="size-4 rounded-sm" />
                      <Skeleton className="h-4 w-24" />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              ))}
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="gap-3 border-t p-4" aria-hidden="true">
        <div className="flex min-w-0 items-center gap-3">
          <Skeleton className="size-9 rounded-full" />
          <div className="grid min-w-0 flex-1 gap-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-36" />
          </div>
        </div>
        <Skeleton className="h-9 w-full" />
      </SidebarFooter>
    </Sidebar>
  );
}
