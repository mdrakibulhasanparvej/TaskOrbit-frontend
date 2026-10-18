import type { Metadata } from "next";
import PlanSelector from "@/components/modules/plan-selector/PlanSelector";
import SubscriptionCard from "@/components/modules/plan-selector/SubscriptionCard";

export const metadata: Metadata = {
  title: "Subscription | TaskOrbit",
};

/**
 * PM subscription surface (plan.md §10 step 16) — current plan + usage from
 * `GET /payments/subscription` (P4) and the upgrade grid from the public
 * plans endpoint (P3). PM-only by the `(dashboard)/project-manager` layout.
 */
export default function SubscriptionPage() {
  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
      <header>
        <h1 className="font-heading text-2xl font-semibold sm:text-3xl">
          Subscription
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your current plan, usage against limits, and every available upgrade.
        </p>
      </header>

      <SubscriptionCard />

      <div>
        <h2 className="mb-4 font-heading text-lg font-semibold">
          Available plans
        </h2>
        <PlanSelector />
      </div>
    </section>
  );
}
