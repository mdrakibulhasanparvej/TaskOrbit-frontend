"use client";

import { IconBrandGoogle } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import type { FetchError } from "ofetch";
import { type ComponentProps, useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useGoogleLogin } from "@/hooks";
import type { TaskOrbitRole } from "@/types";
import triggerToast from "@/utils/triggerToast";
import { Spinner } from "../ui/spinner";

const dashboardPaths: Record<TaskOrbitRole, string> = {
  ADMIN: "/admin",
  PROJECT_MANAGER: "/project-manager",
  TEAM_MEMBER: "/team-member",
  CLIENT: "/client",
};

const GSI_SCRIPT_ID = "google-identity-services";
const GSI_SCRIPT_SRC = "https://accounts.google.com/gsi/client";

interface GsiCredentialResponse {
  credential?: string;
}

interface GsiIdConfiguration {
  client_id: string;
  callback: (response: GsiCredentialResponse) => void;
  cancel_on_tap_outside?: boolean;
  use_fedcm_for_prompt?: boolean;
}

interface GoogleIdentityServices {
  accounts: {
    id: {
      initialize: (config: GsiIdConfiguration) => void;
      prompt: () => void;
    };
  };
}

declare global {
  interface Window {
    google?: GoogleIdentityServices;
  }
}

/** Loads Google's Identity Services script once (no npm dependency). */
function loadGsiScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  if (window.google?.accounts?.id) {
    return Promise.resolve();
  }

  const existing = document.getElementById(GSI_SCRIPT_ID);

  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Google Identity Services failed to load")),
        { once: true },
      );
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = GSI_SCRIPT_ID;
    script.src = GSI_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Google Identity Services failed to load"));
    document.head.appendChild(script);
  });
}

interface IProps {
  isRegister?: boolean;
  buttonProps?: Omit<
    ComponentProps<typeof Button>,
    "children" | "onClick" | "type"
  >;
}

export default function GoogleAuthButton({
  isRegister = false,
  buttonProps,
}: IProps) {
  const router = useRouter();
  const { mutate: submitGoogleLogin, isPending } = useGoogleLogin();
  const [loading, setIsLoading] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const isGoogleAuthEnabled =
    process.env.NEXT_PUBLIC_ENABLE_GOOGLE_AUTH === "true";
  const isBusy = loading || isPending;

  const handleCredential = useCallback(
    (response: GsiCredentialResponse) => {
      const idToken = response.credential;

      if (!idToken) {
        setIsLoading(false);
        triggerToast({
          type: "error",
          title: "Google sign-in failed",
          description: "Google did not return an ID token. Please try again.",
        });
        return;
      }

      submitGoogleLogin(idToken, {
        onSuccess: (res) => {
          setIsLoading(false);

          if (!res.success) {
            triggerToast({
              type: "error",
              title: "Google sign-in failed",
              description: res.message || "Internal Server Error",
            });
            return;
          }

          triggerToast({
            type: "success",
            title: isRegister ? "Account ready" : "Login successful",
            description: "Welcome to TaskOrbit",
          });

          const role = res.data?.role;
          router.push(role ? dashboardPaths[role] : "/login");
        },
        onError: (error: FetchError) => {
          setIsLoading(false);
          triggerToast({
            type: "error",
            title: "Google sign-in failed",
            description: error.data?.message || "Internal Server Error",
          });
        },
      });
    },
    [isRegister, router, submitGoogleLogin],
  );

  useEffect(() => {
    const resetLoading = () => setIsLoading(false);

    resetLoading();
    window.addEventListener("pageshow", resetLoading);
    return () => window.removeEventListener("pageshow", resetLoading);
  }, []);

  if (!isGoogleAuthEnabled) {
    return null;
  }

  if (!clientId) {
    return (
      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled
        title="Set NEXT_PUBLIC_GOOGLE_CLIENT_ID to enable Google sign-in"
        {...buttonProps}
      >
        <IconBrandGoogle aria-hidden="true" />
        {isRegister ? "Sign up with Google" : "Continue with Google"}
      </Button>
    );
  }

  const handleGoogleClick = async () => {
    setIsLoading(true);

    try {
      await loadGsiScript();
    } catch {
      setIsLoading(false);
      triggerToast({
        type: "error",
        title: "Google sign-in unavailable",
        description:
          "Could not reach Google. Check your connection and try again.",
      });
      return;
    }

    const googleId = window.google?.accounts?.id;

    if (!googleId) {
      setIsLoading(false);
      triggerToast({
        type: "error",
        title: "Google sign-in unavailable",
        description: "Google Identity Services did not load.",
      });
      return;
    }

    googleId.initialize({
      client_id: clientId,
      callback: handleCredential,
      cancel_on_tap_outside: false,
      use_fedcm_for_prompt: true,
    });
    googleId.prompt();
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="h-8 w-full"
      disabled={isBusy}
      onClick={handleGoogleClick}
      {...buttonProps}
    >
      {isBusy && <Spinner />}
      <IconBrandGoogle size={28} aria-hidden="true" />
      {isRegister ? "Sign up with Google" : "Continue with Google"}
    </Button>
  );
}
