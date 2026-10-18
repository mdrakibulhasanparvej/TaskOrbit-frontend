"use client";
import { IconEye, IconEyeClosed } from "@tabler/icons-react";
import { useForm } from "@tanstack/react-form";
import { cn } from "cn";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FetchError } from "ofetch";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/hooks";
import { loginSchema } from "@/schemas";
import type { TaskOrbitRole } from "@/types";
import triggerToast from "@/utils/triggerToast";
import GoogleAuthButton from "../Buttons/GoogleAuthButton";
import { ButtonGroup } from "../ui/button-group";
import { Spinner } from "../ui/spinner";

const dashboardPaths: Record<TaskOrbitRole, string> = {
  ADMIN: "/admin",
  PROJECT_MANAGER: "/project-manager",
  TEAM_MEMBER: "/team-member",
};

const DEMO_ACCOUNTS = [
  {
    label: "TaskFlow Admin",
    email: "admin@taskflow.dev",
    password: "Admin@123",
  },
  {
    label: "Manager",
    email: "manager@taskflow.dev",
    password: "Manager@123",
  },
  {
    label: "Team Member",
    email: "member@taskflow.dev",
    password: "Member@123",
  },
];

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const { mutate: login, isPending } = useLogin();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: ({ value }) => {
      const data = {
        email: value.email,
        password: value.password,
      };
      login(data, {
        onSuccess: (res) => {
          if (!res.success) {
            triggerToast({
              type: "error",
              title: "Login Failure",
              description: res.message || "Internal Server error",
            });
            return;
          }
          triggerToast({
            type: "success",
            title: "Login Successful",
            description: "Welcome back to TaskOrbit",
          });

          const role = res.data?.role;
          role
            ? router.push(dashboardPaths[role])
            : router.push("/login");
        },
        onError: (err: FetchError) => {
          const message = err.data?.message;
          triggerToast({
            type: "error",
            title: "Error while login",
            description: message || "Internal Server Error",
          });
        },
      });
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="p-6 md:p-8"
          >
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-balance text-muted-foreground">
                  Login to your TaskOrbit account
                </p>
              </div>

              {/* email */}
              <form.Field name="email">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                      <Input
                        name={field.name}
                        id={field.name}
                        type="email"
                        onBlur={field.handleBlur}
                        placeholder="m@example.com"
                        required
                        onChange={(e) => field.handleChange(e.target.value)}
                        value={field.state.value}
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              {/* password */}
              <form.Field name="password">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowPassword((visible) => !visible)}
                          className="absolute right-2 translate-y-1.5"
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? (
                            <IconEye size={20} />
                          ) : (
                            <IconEyeClosed size={20} />
                          )}
                        </button>
                        <Input
                          name={field.name}
                          id={field.name}
                          type={showPassword ? "text" : "password"}
                          onBlur={field.handleBlur}
                          placeholder="your password"
                          onChange={(e) => field.handleChange(e.target.value)}
                          value={field.state.value}
                          aria-invalid={isInvalid}
                        />
                      </div>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              {/* forget button */}
              <Link
                href="/forgot-password"
                className="ml-auto text-sm underline-offset-2 hover:underline"
              >
                Forgot your password?
              </Link>

              <Button disabled={isPending} type="submit">
                {isPending && <Spinner />}
                {isPending ? "Logging in.." : "Login"}
              </Button>

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or
              </FieldSeparator>

              <GoogleAuthButton />

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or Login as
              </FieldSeparator>

              <ButtonGroup className="mx-auto" aria-label="Demo accounts">
                {DEMO_ACCOUNTS.map((acc) => (
                  <Button
                    key={acc.label}
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      form.setFieldValue("email", acc.email);
                      form.setFieldValue("password", acc.password);
                    }}
                  >
                    {acc.label}
                  </Button>
                ))}
              </ButtonGroup>

              <FieldDescription className="text-center">
                Don&apos;t have an account?{" "}
                <Link href="/registration">Sign up</Link>
              </FieldDescription>
            </FieldGroup>
          </form>

          <div className="relative hidden bg-muted md:block">
            <Image
              fill
              src="/loginBanner.png"
              alt="Login banner"
              sizes="(min-width: 768px) 50vw, 0px"
              quality={90}
              className="object-cover dark:brightness-[0.8]"
              priority
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our{" "}
        <Link href="/terms-of-service">Terms of Service</Link> and{" "}
        <Link href="/privacy-policy">Privacy Policy</Link>.
      </FieldDescription>
    </div>
  );
}
