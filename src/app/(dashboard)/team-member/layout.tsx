import type { ReactNode } from "react";
import RoleGuard from "@/components/authentication/RoleGuard";
import DashboardShell from "@/components/modules/dashboard/DashboardShell";

export default function TeamMemberDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <RoleGuard roles={["TEAM_MEMBER"]}>
      <DashboardShell>{children}</DashboardShell>
    </RoleGuard>
  );
}
