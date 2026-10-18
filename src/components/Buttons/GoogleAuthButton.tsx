"use client";

import { IconBrandGoogle } from "@tabler/icons-react";
import { type ComponentProps, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "../ui/spinner";

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
  const [loading, setIsLoading] = useState(false);
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const isGoogleAuthEnabled =
    process.env.NEXT_PUBLIC_ENABLE_GOOGLE_AUTH === "true";

  useEffect(() => {
    const resetLoading = () => setIsLoading(false);

    resetLoading();
    window.addEventListener("pageshow", resetLoading);
    return () => window.removeEventListener("pageshow", resetLoading);
  }, []);

  // OQ-5: Google sign-in is hidden until the ID-token flow is implemented; the
  // passport-redirect path below no longer exists on the TaskOrbit backend.
  if (!isGoogleAuthEnabled) {
    return null;
  }

  if (!apiBaseUrl) {
    return (
      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled
        title="Set NEXT_PUBLIC_API_BASE_URL to enable Google sign-in"
        {...buttonProps}
      >
        <IconBrandGoogle aria-hidden="true" />
        {isRegister ? "Sign up with Google" : "Continue with Google"}
      </Button>
    );
  }

  const startPassportGoogleAuth = () => {
    setIsLoading(true);
    window.location.assign(`${apiBaseUrl}/auth/google`);
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="h-8 w-full"
      disabled={loading}
      onClick={startPassportGoogleAuth}
      {...buttonProps}
    >
      {loading && <Spinner />}
      <IconBrandGoogle size={28} aria-hidden="true" />
      {isRegister ? "Sign up with Google" : "Continue with Google"}
    </Button>
  );
}
