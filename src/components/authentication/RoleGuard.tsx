"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import { useGetProfile } from "@/hooks";
import type { TaskOrbitRole } from "@/types/user.types";
import AccessDenied from "./AccessDenied";
import AuthLoading from "./AuthLoading";

interface Props {
  children: ReactNode;
  roles: TaskOrbitRole[];
}

export default function RoleGuard({ children, roles }: Props) {
  const router = useRouter();
  const { data, isError, isPending } = useGetProfile();
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
    }
  }, [profile, isError, router, isPending]);

  if (isPending || isError || !profile?.role) {
    return <AuthLoading />;
  }

  // profile.role is still the legacy union until the profile API is swapped in
  // Phase 03; the allow-list already speaks TaskOrbit roles (plan.md §4).
  const isAuthorized = roles.includes(profile.role);

  if (isAuthorized) {
    return <>{children}</>;
  }

  return <AccessDenied />;
}
