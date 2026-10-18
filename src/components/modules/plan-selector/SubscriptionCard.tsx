"use client";

import { IconCreditCard, IconInfoCircle } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMySubscription } from "@/hooks";

/** "Unlimited" is rendered when the backend sends `null` for a limit (§6.3). */
const formatLimit = (value: number | null) =>
  value === null ? "Unlimited" : value.toString();

const formatDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString() : "—";

/**
 * Current subscription card — plan, usage against limits, renewal info
 * (plan.md §5 P4 — `GET /payments/subscription`, auth PM). The "manage"
 * action is informational: the backend has no customer-portal endpoint yet,
 * so checkout of a new plan is the documented upgrade path.
 */
export default function SubscriptionCard() {
  const { data, isLoading, isError, refetch } = useGetMySubscription();
  const subscription = data?.data;

  if (isLoading) {
    return <Skeleton className="h-56 rounded-xl" />;
  }

  if (isError) {
    return (
      <div className="rounded-xl border bg-card px-6 py-10 text-center">
        <p className="font-medium">Couldn&apos;t load your subscription.</p>
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

  if (!subscription) return null;

  const { usage, limits } = subscription;
  const isActive = subscription.status === "ACTIVE";

  return (
    <Card className="flex flex-col gap-6">
      <CardHeader className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-heading text-lg font-semibold">
            {subscription.label}
          </h3>
          <span
            className={
              isActive
                ? "rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                : "rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
            }
          >
            {subscription.status ?? "FREE"}
          </span>
        </div>
        <p className="text-3xl font-semibold tracking-tight">
          ${subscription.price}
          <span className="text-sm font-normal text-muted-foreground">/mo</span>
        </p>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border bg-muted/40 p-3">
            <p className="text-xs text-muted-foreground">Projects</p>
            <p className="mt-1 text-sm font-medium">
              {usage.projects} / {formatLimit(limits.projects)}
            </p>
          </div>
          <div className="rounded-lg border bg-muted/40 p-3">
            <p className="text-xs text-muted-foreground">Members</p>
            <p className="mt-1 text-sm font-medium">
              {usage.members} / {formatLimit(limits.members)}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-1 text-sm text-muted-foreground">
          <p>
            Renews on:{" "}
            <span className="font-medium text-foreground">
              {formatDate(subscription.current_period_end)}
            </span>
          </p>
          {subscription.cancel_at_period_end && (
            <p className="flex items-center gap-1.5 text-amber-600 dark:text-amber-500">
              <IconInfoCircle className="size-4" aria-hidden />
              Cancels at the end of the current period.
            </p>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          To change plans, pick a new one on the pricing page.
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => window.location.assign("/pricing")}
        >
          <IconCreditCard aria-hidden />
          Change plan
        </Button>
      </CardFooter>
    </Card>
  );
}
