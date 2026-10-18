"use client";

import { useForm } from "@tanstack/react-form";
import type { FetchError } from "ofetch";
import { FormField } from "@/components/shared/FormFields";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { useInviteMember } from "@/hooks";
import { inviteMemberSchema } from "@/schemas";
import triggerToast from "@/utils/triggerToast";

export default function InviteMemberDialog({
  projectId,
  open,
  onOpenChange,
}: {
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { mutate: invite, isPending } = useInviteMember();

  const form = useForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onSubmit: inviteMemberSchema,
    },
    onSubmit: ({ value }) => {
      invite(
        { projectId, email: value.email.trim() },
        {
          onSuccess: (response) => {
            if (!response.success) {
              triggerToast({
                type: "error",
                title: "Invitation failed",
                description: response.message || "Please try again.",
              });
              return;
            }

            triggerToast({
              type: "success",
              title: "Invitation sent",
              description:
                response.message || "The invitation email has been sent.",
            });
            form.reset();
            onOpenChange(false);
          },
          onError: (error: FetchError) => {
            triggerToast({
              type: "error",
              title: "Invitation failed",
              description: error.data?.message || "Internal Server Error",
            });
          },
        },
      );
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite member</DialogTitle>
          <DialogDescription>
            Send an invitation email to add a member to this project.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field name="email">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <FormField
                  id={field.name}
                  label="Email address"
                  type="email"
                  autoComplete="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={field.handleChange}
                  isInvalid={isInvalid}
                  errors={field.state.meta.errors}
                  disabled={isPending}
                />
              );
            }}
          </form.Field>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Spinner />}
              {isPending ? "Sending..." : "Send invitation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
