import type { ReactNode } from "react";
import RoleGuard from "@/components/authentication/RoleGuard";
import DashboardShell from "@/components/modules/dashboard/DashboardShell";

export default function ClientDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <RoleGuard roles={["CLIENT"]}>
      <DashboardShell>{children}</DashboardShell>
    </RoleGuard>
  );
}
