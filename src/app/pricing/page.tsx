import type { Metadata } from "next";
import PlanSelector from "@/components/modules/plan-selector/PlanSelector";

export const metadata: Metadata = {
  title: "Pricing | TaskOrbit",
  description:
    "Pick the TaskOrbit plan that fits your team — FREE, PRO or BUSINESS.",
};

export default function PricingPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
      <header className="flex flex-col items-center gap-3 text-center">
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          Pricing
        </h1>
        <p className="max-w-xl text-sm leading-6 text-muted-foreground">
          Simple plans for every team. Upgrade or downgrade at any time —
          billing is handled securely through Stripe.
        </p>
      </header>

      <PlanSelector />
    </main>
  );
}
