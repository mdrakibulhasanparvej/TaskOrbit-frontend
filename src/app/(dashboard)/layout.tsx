"use client";

import type { ReactNode } from "react";
import AuthGuard from "@/components/authentication/AuthGuard";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
