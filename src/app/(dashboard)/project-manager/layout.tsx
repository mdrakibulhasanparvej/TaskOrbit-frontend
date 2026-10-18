import type { ReactNode } from "react";
import RoleGuard from "@/components/authentication/RoleGuard";
import DashboardShell from "@/components/modules/dashboard/DashboardShell";

export default function ProjectManagerDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <RoleGuard roles={["PROJECT_MANAGER"]}>
      <DashboardShell>{children}</DashboardShell>
    </RoleGuard>
  );
}
