"use client";

import { IconCircleCheck, IconCircleX, IconRefresh } from "@tabler/icons-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { FetchError } from "ofetch";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useVerifyPayment } from "@/hooks";

/**
 * Public Stripe return target (OQ-3) — `{FRONTEND_URL}/payment/success`.
 * Verification (`GET /payments/verify`) is PM-authenticated, so an anonymous
 * visitor gets a friendly "sign in to confirm" state instead of an error.
 */
function PublicVerifyResult() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id") ?? "";
  const { data, isLoading, isError, error, refetch } =
    useVerifyPayment(sessionId);

  if (!sessionId) {
    return (
      <div className="rounded-xl border bg-card px-6 py-10 text-center">
        <IconCircleX className="mx-auto size-10 text-destructive" aria-hidden />
        <p className="mt-3 font-medium">Missing session reference</p>
        <p className="mt-1 text-sm text-muted-foreground">
          We couldn&apos;t find a session id in the URL. If you completed a
          payment, sign in to view your subscription and payment history.
        </p>
        <Button type="button" className="mt-4" render={<Link href="/login" />}>
          Sign in
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border bg-card px-6 py-12">
        <Spinner />
        <p className="text-sm text-muted-foreground">Verifying your payment…</p>
      </div>
    );
  }

  if (isError) {
    // 400/401/403 = not signed in as the paying PM — verification itself is
    // auth-guarded; every other error is a genuine verification failure.
    const status = (error as FetchError | null)?.status;
    const needsSignIn = status === 400 || status === 401 || status === 403;

    return (
      <div className="rounded-xl border bg-card px-6 py-10 text-center">
        <IconCircleX className="mx-auto size-10 text-destructive" aria-hidden />
        <p className="mt-3 font-medium">
          {needsSignIn ? "Sign in to confirm" : "Verification failed"}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {needsSignIn
            ? "Your payment is secure — sign in with the account that made the purchase to confirm it."
            : "We couldn't verify this payment. Please check your payment history or contact support."}
        </p>
        <div className="mt-4 flex justify-center gap-2">
          {needsSignIn ? (
            <Button type="button" render={<Link href="/login" />}>
              Sign in
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => void refetch()}
            >
              <IconRefresh aria-hidden />
              Try again
            </Button>
          )}
        </div>
      </div>
    );
  }

  const payment = data?.data;

  return (
    <div className="rounded-xl border bg-card px-6 py-10 text-center">
      <IconCircleCheck className="mx-auto size-10 text-primary" aria-hidden />
      <p className="mt-3 font-heading text-lg font-semibold">
        Payment verified!
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        Your <strong>{payment?.plan}</strong> subscription is active.
      </p>
      <Button type="button" className="mt-4" render={<Link href="/login" />}>
        Go to dashboard
      </Button>
    </div>
  );
}

/** Public payment-success page — Stripe redirect target (plan.md §8, OQ-3). */
export default function PublicPaymentSuccessPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-12 sm:px-6 lg:px-8">
      <header className="text-center">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          Payment success
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We&apos;re confirming your payment with Stripe.
        </p>
      </header>
      <Suspense
        fallback={
          <div className="flex justify-center rounded-xl border bg-card py-12">
            <Spinner />
          </div>
        }
      >
        <PublicVerifyResult />
      </Suspense>
    </main>
  );
}
