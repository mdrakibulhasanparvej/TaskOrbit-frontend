"use client";
import { IconLogout } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import type { FetchError } from "ofetch";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks";
import triggerToast from "@/utils/triggerToast";

export default function LogoutButton() {
  const router = useRouter();
  const { mutate: logout } = useLogout();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        triggerToast({
          type: "success",
          title: "Logged out",
          description: "You have been logged out successfully.",
        });
        router.push("/login");
      },
      onError: (error: FetchError) => {
        const message = error.data?.message;
        triggerToast({
          type: "error",
          title: "Logout failed",
          description: message || "An error occurred while logging out.",
        });
      },
    });
  };

  return (
    <Button
      onClick={handleLogout}
      type="button"
      variant="ghost"
      className="w-full justify-start text-red-600 border-red-600 hover:bg-red-600 hover:text-white dark:hover:bg-red-600"
    >
      <IconLogout aria-hidden="true" />
      Log out
    </Button>
  );
}
