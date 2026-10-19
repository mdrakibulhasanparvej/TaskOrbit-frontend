"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { FetchError } from "ofetch";
import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useAcceptInvitation, useGetProfile } from "@/hooks";

type State =
  | { status: "loading" }
  | { status: "success"; message: string }
  | {
      status: "error";
      message: string;
      kind?: "already" | "expired" | "auth" | "generic";
    };

function InvitationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [state, setState] = useState<State>({ status: "loading" });
  const [accepted, setAccepted] = useState(false);
  // 🎯 প্রজেক্ট আইডি সেভ করার জন্য নতুন স্টেট
  const [acceptedProjectId, setAcceptedProjectId] = useState<string | null>(
    null,
  );

  const { mutate: acceptInvitation } = useAcceptInvitation();
  const { data: profileResponse, isPending: isProfileLoading } =
    useGetProfile();
  const profile = profileResponse?.data;

  const dashboardPath = (role?: string | null) => {
    if (role === "PROJECT_MANAGER") return "/project-manager";
    if (role === "TEAM_MEMBER") return "/team-member";
    if (role === "ADMIN") return "/admin";
    if (role === "CLIENT") return "/client";
    return "/login";
  };

  useEffect(() => {
    if (!token) {
      setState({
        status: "error",
        message: "Invalid invitation link. The token is missing from the URL.",
        kind: "generic",
      });
      return;
    }

    acceptInvitation(token, {
      onSuccess: (response) => {
        if (!response?.success) {
          setState({
            status: "error",
            message: response?.message || "Invitation could not be accepted.",
            kind: "generic",
          });
          return;
        }

        // Backend returns the project object (`id`), not `project_id`.
        const projectId = (response.data as { id?: string } | null | undefined)
          ?.id;

        if (projectId) {
          localStorage.setItem("active_project_id", projectId);
          setAcceptedProjectId(projectId);
        }

        setState({
          status: "success",
          message: response.message || "Invitation accepted! Redirecting...",
        });
        setAccepted(true);
      },
      onError: (error: FetchError) => {
        const backendMessage = String(error.data?.message || "").toLowerCase();
        if (
          backendMessage.includes("duplicate") ||
          backendMessage.includes("already") ||
          backendMessage.includes("member")
        ) {
          setState({
            status: "error",
            message: "You're already a member of this project.",
            kind: "already",
          });
          return;
        }
        if (
          backendMessage.includes("expired") ||
          backendMessage.includes("invalid")
        ) {
          setState({
            status: "error",
            message: "This invitation link has expired.",
            kind: "expired",
          });
          return;
        }
        setState({
          status: "error",
          message: error.data?.message || "Failed to accept invitation.",
          kind: "generic",
        });
      },
    });
  }, [token]);

  useEffect(() => {
    if (!accepted || isProfileLoading) return;
    const timer = setTimeout(() => {
      // 🎯 টিম মেম্বার হলে সরাসরি my-tasks পেজে projectId সহ রিডাইরেক্ট
      if (profile?.role === "TEAM_MEMBER" && acceptedProjectId) {
        router.push(`/team-member/my-tasks?projectId=${acceptedProjectId}`);
      } else {
        router.push(dashboardPath(profile?.role));
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [accepted, isProfileLoading, profile, acceptedProjectId]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Project Invitation</CardTitle>
          <CardDescription>
            {state.status === "loading" && "Accepting your invitation..."}
            {state.status === "success" && "You're in!"}
            {state.status === "error" && "Something went wrong"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 text-center">
          {state.status === "loading" && (
            <>
              <Spinner className="size-8" />
              <p className="text-sm text-muted-foreground">
                Please wait while we verify your invitation token.
              </p>
            </>
          )}
          {state.status === "success" && (
            <>
              <div className="flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                ✓
              </div>
              <p className="text-sm text-foreground">{state.message}</p>
              {isProfileLoading && (
                <p className="text-xs text-muted-foreground">
                  Loading your profile...
                </p>
              )}
            </>
          )}
          {state.status === "error" && (
            <>
              <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                ✕
              </div>
              <p className="text-sm text-muted-foreground">{state.message}</p>
            </>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          {state.status === "error" && (
            <>
              {profile?.role && (
                <Button
                  className="w-full"
                  onClick={() => router.push(dashboardPath(profile.role))}
                >
                  Go to my dashboard
                </Button>
              )}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push("/login")}
              >
                Go to login
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

export default function InvitationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
          <Spinner className="size-8" />
        </div>
      }
    >
      <InvitationContent />
    </Suspense>
  );
}
