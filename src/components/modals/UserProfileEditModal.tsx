"use client";

import { IconEdit } from "@tabler/icons-react";
import { useForm } from "@tanstack/react-form";
import type { FetchError } from "ofetch";
import { useState } from "react";
import { useUpdateUserProfile } from "@/hooks";
import { userProfileUpdateSchema } from "@/schemas";
import type { UserProfile } from "@/types";
import triggerToast from "@/utils/triggerToast";
import { FormField, getDirtyFields } from "../shared/FormFields";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { FieldGroup } from "../ui/field";
import { Spinner } from "../ui/spinner";

interface Props {
  profile: UserProfile;
}

export default function UserProfileEditModal({ profile }: Props) {
  const [open, setOpen] = useState(false);
  const { mutate: update, isPending } = useUpdateUserProfile();

  const form = useForm({
    defaultValues: {
      name: profile.name,
    },
    validators: {
      onSubmit: ({ value }) => {
        const result = userProfileUpdateSchema.safeParse(value);
        return result.success ? undefined : result.error;
      },
    },
    onSubmit: ({ value, formApi }) => {
      const dirtyValues = getDirtyFields(
        value,
        (field) => formApi.getFieldMeta(field)?.isDirty ?? false,
      );
      const result = userProfileUpdateSchema.safeParse(dirtyValues);
      if (!result.success) return;

      update(result.data, {
        onSuccess: (res) => {
          if (!res.success) {
            triggerToast({
              type: "error",
              title: "Profile update failed",
              description: res.message || "Please try again.",
            });
            return;
          }
          triggerToast({
            type: "success",
            title: "Profile updated",
            description: res.message || "Your profile has been updated.",
          });
          setOpen(false);
        },
        onError: (error: FetchError) => {
          triggerToast({
            type: "error",
            title: "Profile update failed",
            description: error.data?.message,
          });
        },
      });
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          form.reset();
        }
      }}
    >
      <DialogTrigger
        render={
          <Button type="button" variant="outline" size="sm">
            <IconEdit aria-hidden="true" />
            Edit
          </Button>
        }
      />
      <DialogContent className="sm:max-w-lg">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            form.handleSubmit();
          }}
        >
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              only updatable fields are shown here.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="py-5">
            <form.Field name="name">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <FormField
                    id={field.name}
                    label="Name"
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
          </FieldGroup>

          <DialogFooter>
            <DialogClose
              render={
                <Button variant="outline" disabled={isPending}>
                  Cancel
                </Button>
              }
            />

            {
              <form.Subscribe
                selector={(state) => [state.isDefaultValue, state.canSubmit]}
              >
                {([isDefaultValue, canSubmit]) => (
                  <Button
                    type="submit"
                    disabled={isPending || isDefaultValue || !canSubmit}
                  >
                    {isPending && <Spinner />}
                    {isPending ? "Saving..." : "Save changes"}
                  </Button>
                )}
              </form.Subscribe>
            }
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
