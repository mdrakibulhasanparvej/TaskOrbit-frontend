import { IconArrowLeft } from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Checkout Cancelled | TaskOrbit",
};

/** Public payment-cancel page — Stripe redirect target (plan.md §8, OQ-3). */
export default function PublicPaymentCancelPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-12 sm:px-6 lg:px-8">
      <header className="text-center">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
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
          <Button type="button" render={<Link href="/pricing" />}>
            <IconArrowLeft aria-hidden />
            Back to pricing
          </Button>
          <Button
            type="button"
            variant="outline"
            render={<Link href="/login" />}
          >
            Sign in
          </Button>
        </div>
      </div>
    </main>
  );
}
