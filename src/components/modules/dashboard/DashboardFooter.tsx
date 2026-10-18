import LogoutButton from "@/components/Buttons/LogoutButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarFooter } from "@/components/ui/sidebar";
import type { UserProfile } from "@/types";
import getInitials from "@/utils/getInitials";

export default function DashboardFooter({ profile }: { profile: UserProfile }) {
  const initials = getInitials(profile?.name ?? "");

  return (
    <SidebarFooter className="gap-3 border-t p-4">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar className="size-9">
          <AvatarImage
            src={profile?.profile_url ?? undefined}
            alt={profile?.name ?? "User profile"}
          />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex flex-col flex-1 gap-0.5">
          <span className="truncate text-sm font-medium">
            {profile?.name ?? "Loading profile..."}
          </span>

          <span className="truncate text-xs text-muted-foreground">
            {profile?.email ?? ""}
          </span>
        </div>
      </div>
      <LogoutButton />
    </SidebarFooter>
  );
}
