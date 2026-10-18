"use client";

import { IconActivity, IconRefresh } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { useGetAdminAnalytics } from "@/hooks";
import MonthlyRevenueChart from "./MonthlyRevenueChart";
import MonthlySignupsChart from "./MonthlySignupsChart";
import OverviewSkeleton from "./OverviewSkeleton";
import OverviewStatCards from "./OverviewStatCards";
import TasksByStatusChart from "./TasksByStatusChart";

/**
 * Admin analytics shell (plan.md §10 step 8). Fetches `GET /analytics/admin`
 * and composes the PM-cohort stat cards and charts. The legacy
 * `super-admin-overview/*` folder stays on disk untouched (Class C).
 */
export default function Overview() {
  const { data, isLoading, isError, refetch } = useGetAdminAnalytics();
  const analytics = data?.data;

  if (isLoading) {
    return <OverviewSkeleton />;
  }

  if (isError || !analytics) {
    return (
      <section className="mx-auto flex min-h-96 w-full max-w-7xl flex-col items-center justify-center px-4 py-12 text-center">
        <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
          <IconActivity className="size-6" aria-hidden="true" />
        </div>
        <h1 className="text-lg font-semibold">Overview unavailable</h1>
        <p className="mt-1 max-w-md text-sm text-muted-foreground">
          We couldn&apos;t load the platform analytics. Please try again.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-5"
          onClick={() => void refetch()}
        >
          <IconRefresh aria-hidden="true" />
          Retry
        </Button>
      </section>
    );
  }

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <header className="space-y-2">
        <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
          Platform overview
        </h1>
        <p className="text-sm text-muted-foreground">
          Users, projects, tasks, and subscription revenue across TaskOrbit.
        </p>
      </header>

      <OverviewStatCards analytics={analytics} />

      <div className="grid gap-4 lg:grid-cols-2">
        <MonthlyRevenueChart analytics={analytics} />
        <MonthlySignupsChart analytics={analytics} />
        <TasksByStatusChart analytics={analytics} />
      </div>
    </section>
  );
}
