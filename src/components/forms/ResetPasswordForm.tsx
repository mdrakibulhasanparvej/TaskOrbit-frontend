"use client";

import { IconLock } from "@tabler/icons-react";
import { useForm } from "@tanstack/react-form";
import { cn } from "cn";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { FetchError } from "ofetch";
import { FormField } from "@/components/shared/FormFields";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldDescription, FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { useResetPassword } from "@/hooks";
import { resetPasswordSchema } from "@/schemas";
import triggerToast from "@/utils/triggerToast";

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const { mutate: resetPassword, isPending } = useResetPassword();

  const form = useForm({
    defaultValues: {
      email,
      otp: "",
      new_password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: resetPasswordSchema,
    },
    onSubmit: ({ value }) => {
      resetPassword(
        {
          email: value.email,
          otp: value.otp,
          new_password: value.new_password,
        },
        {
          onSuccess: (res) => {
            if (!res.success) {
              triggerToast({
                type: "error",
                title: "Password reset failed",
                description: res.message || "Internal Server Error",
              });
              return;
            }

            triggerToast({
              type: "success",
              title: "Password reset successful",
              description:
                res.message || "Please sign in with your new password.",
            });

            router.push("/login");
          },
          onError: (error: FetchError) => {
            triggerToast({
              type: "error",
              title: "Password reset failed",
              description: error.data?.message || "Internal Server Error",
            });
          },
        },
      );
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-border/70 shadow-sm">
        <CardHeader className="items-center px-6 pt-8 text-center sm:px-8">
          <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <IconLock className="size-6" aria-hidden="true" />
          </div>
          <CardTitle className="text-2xl tracking-tight">
            Set a new password
          </CardTitle>
          <CardDescription className="mt-1 max-w-sm text-sm leading-6">
            Enter the 6-digit code we emailed you and choose a new password.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 pb-8 sm:px-8">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              event.stopPropagation();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.Field name="email">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <FormField
                      id={field.name}
                      label="Email"
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

              <form.Field name="otp">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <FormField
                      id={field.name}
                      label="OTP"
                      inputMode="numeric"
                      autoComplete="one-time-code"
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

              <form.Field name="new_password">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <FormField
                      id={field.name}
                      label="New password"
                      type="password"
                      autoComplete="new-password"
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

              <form.Field name="confirmPassword">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <FormField
                      id={field.name}
                      label="Confirm new password"
                      type="password"
                      autoComplete="new-password"
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

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending && <Spinner />}
                {isPending ? "Resetting.." : "Reset password"}
              </Button>

              <FieldDescription className="text-center">
                <Link
                  href="/login"
                  className="font-medium text-foreground underline-offset-4 hover:underline"
                >
                  Back to sign in
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
