"use client";

import type { FetchError } from "ofetch";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useUpdateAdminUserRole } from "@/hooks";
import type { AdminUser, TaskOrbitRole } from "@/types";
import triggerToast from "@/utils/triggerToast";

const ROLE_OPTIONS: { value: TaskOrbitRole; label: string }[] = [
  { value: "ADMIN", label: "Admin" },
  { value: "PROJECT_MANAGER", label: "Project Manager" },
  { value: "TEAM_MEMBER", label: "Team Member" },
];

/**
 * Dialog to change a user's platform role (plan.md §9 —
 * `PATCH /admin/users/:id/role`). The backend rejects self-demotion and any
 * change to the protected primary admin; those 4xx messages surface as
 * error toasts.
 */
export default function ChangeRoleDialog({
  user,
  open,
  onOpenChange,
}: {
  user: AdminUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [role, setRole] = useState<TaskOrbitRole>(user.role);
  const { mutate: updateRole, isPending } = useUpdateAdminUserRole();

  const handleSubmit = () => {
    if (role === user.role || isPending) return;

    updateRole(
      { userId: user.id, payload: { role } },
      {
        onSuccess: (response) => {
          if (!response.success) {
            triggerToast({
              type: "error",
              title: "Role change failed",
              description: response.message || "Please try again.",
            });
            return;
          }

          triggerToast({
            type: "success",
            title: "Role updated",
            description: `${user.name} is now ${role.replace("_", " ").toLowerCase()}.`,
          });
          onOpenChange(false);
        },
        onError: (error: FetchError) => {
          triggerToast({
            type: "error",
            title: "Role change failed",
            description: error.data?.message || "Internal Server Error",
          });
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change role</DialogTitle>
          <DialogDescription>
            Update the platform role for <strong>{user.name}</strong> (
            {user.email}).
          </DialogDescription>
        </DialogHeader>

        <Select
          value={role}
          onValueChange={(value) => setRole(value as TaskOrbitRole)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Pick a role" />
          </SelectTrigger>
          <SelectContent>
            {ROLE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DialogFooter>
          <DialogClose render={<Button type="button" variant="outline" />}>
            Cancel
          </DialogClose>
          <Button
            type="button"
            disabled={isPending || role === user.role}
            onClick={handleSubmit}
          >
            {isPending && <Spinner />}
            Save role
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
