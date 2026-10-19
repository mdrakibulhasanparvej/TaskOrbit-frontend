import type { Metadata } from "next";
import PlanSelector from "@/components/modules/plan-selector/PlanSelector";
import SubscriptionCard from "@/components/modules/plan-selector/SubscriptionCard";

export const metadata: Metadata = {
  title: "Subscription | TaskOrbit",
};

/**
 * Client subscription surface — current plan from `GET /payments/subscription`
 * and the upgrade grid from the public plans endpoint. CLIENT-only by the
 * `(dashboard)/client` layout.
 */
export default function ClientSubscriptionPage() {
  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
      <header>
        <h1 className="font-heading text-2xl font-semibold sm:text-3xl">
          Subscription
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your current plan and every available upgrade.
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
