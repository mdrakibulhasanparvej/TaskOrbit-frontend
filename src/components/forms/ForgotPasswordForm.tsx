"use client";

import { IconKey } from "@tabler/icons-react";
import { useForm } from "@tanstack/react-form";
import { cn } from "cn";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { useForgotPassword } from "@/hooks";
import { forgotPasswordSchema } from "@/schemas";
import triggerToast from "@/utils/triggerToast";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const { mutate: forgotPassword, isPending } = useForgotPassword();

  const form = useForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onSubmit: forgotPasswordSchema,
    },
    onSubmit: ({ value }) => {
      forgotPassword(value, {
        onSuccess: (res) => {
          if (!res.success) {
            triggerToast({
              type: "error",
              title: "Could not send reset code",
              description: res.message || "Internal Server Error",
            });
            return;
          }

          triggerToast({
            type: "success",
            title: "Check your email",
            description:
              res.message || "We sent a 6-digit code to reset your password.",
          });

          router.push(
            `/reset-password?email=${encodeURIComponent(value.email)}`,
          );
        },
        onError: (error: FetchError) => {
          triggerToast({
            type: "error",
            title: "Could not send reset code",
            description: error.data?.message || "Internal Server Error",
          });
        },
      });
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-border/70 shadow-sm">
        <CardHeader className="items-center px-6 pt-8 text-center sm:px-8">
          <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <IconKey className="size-6" aria-hidden="true" />
          </div>
          <CardTitle className="text-2xl tracking-tight">
            Forgot your password?
          </CardTitle>
          <CardDescription className="mt-1 max-w-sm text-sm leading-6">
            Enter the email linked to your account and we&apos;ll send you a
            6-digit code to reset your password.
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

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending && <Spinner />}
                {isPending ? "Sending code.." : "Send reset code"}
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
