"use client";

import ThemeToggleButton from "@/components/Buttons/ThemeToggleButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGetProfile } from "@/hooks";
import getInitials from "@/utils/getInitials";

export function DashboardHeader() {
  const { data, isPending } = useGetProfile();
  const profile = data?.data;
  const initials = getInitials(profile?.name ?? "");

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 " />
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggleButton />
          <Separator orientation="vertical" className="mx-2 " />
          {isPending ? (
            <Spinner />
          ) : (
            <Tooltip>
              <TooltipTrigger
                render={
                  <button
                    type="button"
                    aria-label={profile?.name ?? "User profile"}
                    className="rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                  />
                }
              >
                <Avatar>
                  <AvatarImage
                    src={profile?.profile_url ?? undefined}
                    alt={profile?.name ?? "User profile"}
                  />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>{profile?.name ?? "User profile"}</TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </header>
  );
}
