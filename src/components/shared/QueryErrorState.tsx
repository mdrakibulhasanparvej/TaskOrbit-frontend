"use client";

import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

export default function QueryErrorState({ reset }: { reset: () => void }) {
  const { reset: resetQueryError } = useQueryErrorResetBoundary();

  function handleRetry() {
    resetQueryError();
    reset();
  }

  return (
    <main
      className="flex min-h-[50vh] flex-col items-center justify-center gap-3 p-6 text-center"
      role="alert"
    >
      <h2 className="text-lg font-semibold">We couldn&apos;t load this page</h2>
      <p className="max-w-md text-sm text-muted-foreground">
        Something went wrong while loading your data. Check your connection and
        try again.
      </p>
      <Button type="button" variant="outline" onClick={handleRetry}>
        Try again
      </Button>
    </main>
  );
}