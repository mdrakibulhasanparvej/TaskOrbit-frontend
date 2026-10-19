"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import { useGetProfile } from "@/hooks";
import type { TaskOrbitRole } from "@/types";
import AuthLoading from "./AuthLoading";

const dashboardPaths: Record<TaskOrbitRole, string> = {
  ADMIN: "/admin",
  PROJECT_MANAGER: "/project-manager",
  TEAM_MEMBER: "/team-member",
  CLIENT: "/client",
};

interface Props {
  children?: ReactNode;
  redirectAuthenticatedUser?: boolean;
}

export default function AuthGuard({
  children,
  redirectAuthenticatedUser = false,
}: Props) {
  const router = useRouter();
  const { data, isPending, isError } = useGetProfile();
  const profile = data?.data;

  useEffect(() => {
    if (isPending) {
      return;
    }
    if (isError || !profile) {
      router.replace("/login");
      return;
    }
    if (!profile.role) {
      router.replace("/login");
      return;
    }
    if (redirectAuthenticatedUser) {
      // profile.role is still the legacy union until the profile API is swapped
      // in Phase 03; the guard already speaks TaskOrbit roles (plan.md §4).
      router.replace(dashboardPaths[profile.role as TaskOrbitRole]);
    }
  }, [profile, isError, router, isPending, redirectAuthenticatedUser]);

  if (
    isPending ||
    isError ||
    !profile ||
    !profile.role ||
    redirectAuthenticatedUser
  ) {
    return <AuthLoading />;
  }

  return children;
}
