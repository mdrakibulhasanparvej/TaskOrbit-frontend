"use client";

import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/** Dashboard payment-cancel page — Stripe returned without completing. */
export default function PaymentCancelPage() {
  return (
    <section className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <header>
        <h1 className="font-heading text-2xl font-semibold sm:text-3xl">
          Checkout cancelled
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          No charge was made. You can retry the checkout whenever you&apos;re
          ready.
        </p>
      </header>

      <div className="rounded-xl border bg-card px-6 py-10 text-center">
        <p className="text-sm text-muted-foreground">
          Your current plan is unchanged.
        </p>
        <div className="mt-4 flex justify-center gap-2">
          <Button
            type="button"
            render={<Link href="/project-manager/subscription" />}
          >
            <IconArrowLeft aria-hidden />
            Back to subscription
          </Button>
          <Button
            type="button"
            variant="outline"
            render={<Link href="/pricing" />}
          >
            View plans
          </Button>
        </div>
      </div>
    </section>
  );
}
