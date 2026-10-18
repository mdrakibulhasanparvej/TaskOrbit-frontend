"use client";

import { IconCircleCheck, IconCircleX, IconRefresh } from "@tabler/icons-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useVerifyPayment } from "@/hooks";

function PaymentVerifyResult() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id") ?? "";
  const { data, isLoading, isError, refetch } = useVerifyPayment(sessionId);

  if (!sessionId) {
    return (
      <div className="rounded-xl border bg-card px-6 py-10 text-center">
        <IconCircleX className="mx-auto size-10 text-destructive" aria-hidden />
        <p className="mt-3 font-medium">Missing session reference</p>
        <p className="mt-1 text-sm text-muted-foreground">
          We couldn&apos;t find a session id in the URL. If you completed a
          payment, it will still appear in your payment history.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-4"
          render={<Link href="/project-manager/payment-history" />}
        >
          View payment history
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

  if (isError || !data?.success || !data.data) {
    return (
      <div className="rounded-xl border bg-card px-6 py-10 text-center">
        <IconCircleX className="mx-auto size-10 text-destructive" aria-hidden />
        <p className="mt-3 font-medium">Verification failed</p>
        <p className="mt-1 text-sm text-muted-foreground">
          We couldn&apos;t verify this payment. Please check your payment
          history or contact support.
        </p>
        <div className="mt-4 flex justify-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => void refetch()}
          >
            <IconRefresh aria-hidden />
            Try again
          </Button>
          <Button
            type="button"
            render={<Link href="/project-manager/payment-history" />}
          >
            View payment history
          </Button>
        </div>
      </div>
    );
  }

  const payment = data.data;

  return (
    <div className="rounded-xl border bg-card px-6 py-10 text-center">
      <IconCircleCheck className="mx-auto size-10 text-primary" aria-hidden />
      <p className="mt-3 font-heading text-lg font-semibold">
        Payment verified!
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        Your <strong>{payment.plan}</strong> subscription is active.{" "}
        {payment.transactionId
          ? `Transaction ${payment.transactionId}.`
          : undefined}
      </p>
      <div className="mt-4 flex justify-center gap-2">
        <Button
          type="button"
          render={<Link href="/project-manager/subscription" />}
        >
          View subscription
        </Button>
        <Button
          type="button"
          variant="outline"
          render={<Link href="/project-manager/payment-history" />}
        >
          Payment history
        </Button>
      </div>
    </div>
  );
}

/** Dashboard payment-success page (plan.md §10 step 16, OQ-3 sibling). */
export default function PaymentSuccessPage() {
  return (
    <section className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <header>
        <h1 className="font-heading text-2xl font-semibold sm:text-3xl">
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
        <PaymentVerifyResult />
      </Suspense>
    </section>
  );
}
