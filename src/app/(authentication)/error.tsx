"use client";

import QueryErrorState from "@/components/shared/QueryErrorState";

export default function AuthenticationError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <QueryErrorState reset={reset} />;
}