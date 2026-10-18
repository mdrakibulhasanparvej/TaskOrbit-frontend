"use client";

import type { FetchError } from "ofetch";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useGetAdminSettings, useUpdateAdminSettings } from "@/hooks";
import type { PlatformSettings } from "@/types";
import triggerToast from "@/utils/triggerToast";

/**
 * Platform settings form (plan.md §9 — GET/PATCH /admin/settings).
 * `maintenance_mode` 503s every non-auth route on the backend, so it gets an
 * explicit warning. The email field is validated client-side before PATCH.
 */
export default function PlatformSettingsForm() {
  const { data, isLoading, isError, refetch } = useGetAdminSettings();
  const { mutate: updateSettings, isPending } = useUpdateAdminSettings();

  const [form, setForm] = useState<PlatformSettings | null>(null);
  const [supportEmail, setSupportEmail] = useState("");

  // hydrate the local form once the query resolves
  useEffect(() => {
    const settings = data?.data;
    if (settings) {
      setForm(settings);
      setSupportEmail(settings.support_email);
    }
  }, [data]);

  if (isLoading) {
    return <Skeleton className="h-72 rounded-xl" />;
  }

  if (isError || !form) {
    return (
      <div className="rounded-xl border bg-card px-6 py-12 text-center">
        <p className="font-medium">Couldn&apos;t load settings.</p>
        <Button
          type="button"
          variant="outline"
          className="mt-4"
          onClick={() => void refetch()}
        >
          Try again
        </Button>
      </div>
    );
  }

  const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(supportEmail);
  const emailChanged = supportEmail !== form.support_email;
  const dirty =
    form.maintenance_mode !== data?.data?.maintenance_mode ||
    form.registration_open !== data?.data?.registration_open ||
    emailChanged;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isPending) return;

    if (emailChanged && !emailLooksValid) {
      triggerToast({
        type: "error",
        title: "Invalid email",
        description: "Enter a valid support email address.",
      });
      return;
    }

    updateSettings(
      {
        maintenance_mode: form.maintenance_mode,
        registration_open: form.registration_open,
        ...(emailChanged ? { support_email: supportEmail } : {}),
      },
      {
        onSuccess: (response) => {
          if (!response.success) {
            triggerToast({
              type: "error",
              title: "Settings update failed",
              description: response.message || "Please try again.",
            });
            return;
          }

          triggerToast({
            type: "success",
            title: "Settings saved",
            description: "Platform settings are up to date.",
          });
        },
        onError: (error: FetchError) => {
          triggerToast({
            type: "error",
            title: "Settings update failed",
            description: error.data?.message || "Internal Server Error",
          });
        },
      },
    );
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Platform settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <label className="flex items-start justify-between gap-4 rounded-lg border p-4">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">Maintenance mode</span>
              <span className="text-xs text-muted-foreground">
                When on, every route except authentication returns 503. Use only
                for planned downtime.
              </span>
            </div>
            <input
              type="checkbox"
              checked={form.maintenance_mode}
              onChange={(event) =>
                setForm({ ...form, maintenance_mode: event.target.checked })
              }
              className="mt-1 size-4 accent-primary"
            />
          </label>

          <label className="flex items-start justify-between gap-4 rounded-lg border p-4">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">Registration open</span>
              <span className="text-xs text-muted-foreground">
                When off, new sign-ups are rejected at registration.
              </span>
            </div>
            <input
              type="checkbox"
              checked={form.registration_open}
              onChange={(event) =>
                setForm({ ...form, registration_open: event.target.checked })
              }
              className="mt-1 size-4 accent-primary"
            />
          </label>

          <div className="flex flex-col gap-2">
            <Label htmlFor="support-email">Support email</Label>
            <Input
              id="support-email"
              type="email"
              value={supportEmail}
              onChange={(event) => setSupportEmail(event.target.value)}
              placeholder="support@example.com"
              aria-invalid={emailChanged && !emailLooksValid}
            />
            {emailChanged && !emailLooksValid && (
              <p className="text-sm text-destructive">
                Enter a valid email address.
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Receives copies of public contact-form submissions.
            </p>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isPending || !dirty}>
              {isPending && <Spinner />}
              Save settings
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
