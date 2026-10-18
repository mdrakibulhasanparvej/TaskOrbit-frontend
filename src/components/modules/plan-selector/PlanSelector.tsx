"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetPlans } from "@/hooks";
import type { PlanInfo } from "@/types";
import PricingCard from "./PricingCard";

/**
 * Grid of the platform's pricing tiers (plan.md §5 P3 — public
 * `GET /payments/plans`). Shared by the public `/pricing` page and the
 * PM subscription surface.
 */
export default function PlanSelector({
  currentPlan,
  onManage,
}: {
  /** When given, the matching card is highlighted and CTA swaps to "Manage". */
  currentPlan?: string;
  onManage?: () => void;
}) {
  const { data, isLoading, isError, refetch } = useGetPlans();
  const plans: PlanInfo[] = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border bg-card px-6 py-10 text-center">
        <p className="font-medium">Couldn&apos;t load plans.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Check your connection and try again.
        </p>
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

  if (plans.length === 0) {
    return (
      <div className="rounded-xl border bg-card px-6 py-10 text-center">
        <p className="font-medium">No plans available right now.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Please check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <PricingCard
            key={plan.plan}
            plan={plan}
            highlight={Boolean(currentPlan) && plan.plan === currentPlan}
          />
        ))}
      </div>
      {currentPlan && onManage && (
        <div className="flex justify-center">
          <Button type="button" variant="outline" onClick={onManage}>
            Manage subscription
          </Button>
        </div>
      )}
    </div>
  );
}
