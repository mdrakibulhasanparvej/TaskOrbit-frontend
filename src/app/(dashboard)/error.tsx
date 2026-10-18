"use client";

import QueryErrorState from "@/components/shared/QueryErrorState";

export default function DashboardError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <QueryErrorState reset={reset} />;
}
