"use client";

import { IconAlertCircle, IconShieldCheck } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect } from "react";
import Logo from "@/components/shared/Logo";
import { useGetProfile } from "@/hooks";
import type { TaskOrbitRole } from "@/types";

const dashboardPaths: Record<TaskOrbitRole, string> = {
  ADMIN: "/admin",
  PROJECT_MANAGER: "/project-manager",
  TEAM_MEMBER: "/team-member",
  CLIENT: "/client",
};

export default function OAuthProgressPage() {
  const { data, isPending, isError } = useGetProfile();
  const profile = data?.data;
  const StatusIcon = isError ? IconAlertCircle : IconShieldCheck;

  useEffect(() => {
    if (isPending || isError || !profile) {
      return;
    }

    // profile.role is still the legacy union until the profile API is swapped
    // in Phase 03; the map already speaks TaskOrbit roles (plan.md §4).
    const destination = profile.role
      ? dashboardPaths[profile.role as TaskOrbitRole]
      : "/login";
    window.location.replace(destination);
  }, [profile, isError, isPending]);

  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden px-5 py-12 text-[#18221f]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[url('/progress-banner.svg')] bg-cover bg-center"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-black/35"
      />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center">
        <div className="mb-8 [&_span]:text-[#146c52]">
          <Logo />
        </div>

        <section
          aria-labelledby="oauth-progress-title"
          aria-live="polite"
          className="w-full rounded-2xl border border-[#e4e9e6] bg-white px-7 py-9 text-center shadow-[0_24px_80px_-36px_rgba(20,50,38,0.28)] sm:px-10"
        >
          <div
            className={`mx-auto mb-6 flex size-16 items-center justify-center rounded-full ${
              isError
                ? "bg-destructive/10 text-destructive"
                : "bg-[#eaf5ef] text-[#087653]"
            }`}
          >
            <StatusIcon size={30} stroke={1.7} aria-hidden="true" />
          </div>

          <h1
            id="oauth-progress-title"
            className="text-xl font-semibold tracking-normal"
          >
            Securing your account
          </h1>
          <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-[#66736d]">
            {isError
              ? "Google approved sign-in, but we couldn’t verify your TaskOrbit session."
              : "We’re verifying your TaskOrbit session and preparing your workspace."}
          </p>

          {isError ? (
            <div className="mt-8 rounded-lg bg-[#f7faf8] px-4 py-4 text-left">
              <p className="text-sm leading-6 text-[#34463d]">
                Your session cookie may not have been saved or sent by the
                browser. Please try signing in again. If this keeps happening,
                contact your administrator.
              </p>
              <Link
                href="/login"
                className="mt-3 inline-flex text-sm font-semibold text-[#087653] underline underline-offset-4"
              >
                Return to sign in
              </Link>
            </div>
          ) : (
            <div className="mt-8 flex items-center justify-center gap-3 rounded-lg bg-[#f7faf8] px-4 py-3.5 text-left">
              <span
                aria-hidden="true"
                className="size-5 shrink-0 animate-spin rounded-full border-2 border-[#c8ded3] border-t-[#087653]"
              />
              <span className="text-sm font-medium text-[#34463d]">
                {isPending
                  ? "Verifying account..."
                  : "Account verified. Redirecting..."}
              </span>
            </div>
          )}

          {!isError && (
            <p className="mt-5 text-xs text-[#87928c]">
              Please keep this page open for a moment.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
