import type { ReactNode } from "react";
import AuthLayoutHeader from "@/components/authentication/AuthLayoutHeader";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col bg-muted">
      <AuthLayoutHeader />
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
