"use client";

import { IconCheck, IconCreditCard } from "@tabler/icons-react";
import type { FetchError } from "ofetch";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useCreateStripeCheckout } from "@/hooks";
import type { Plan, PlanInfo } from "@/types";
import triggerToast from "@/utils/triggerToast";

/** "Unlimited" is rendered when the backend sends `null` for a limit (§6.3). */
const formatLimit = (value: number | null) =>
  value === null ? "Unlimited" : value.toString();

/**
 * One pricing tier on the public `/pricing` page (plan.md §5 P3, §6.3).
 * FREE is displayed but never purchasable — only PRO/BUSINESS get a CTA.
 */
export default function PricingCard({
  plan,
  highlight = false,
}: {
  plan: PlanInfo;
  highlight?: boolean;
}) {
  const { mutate: createCheckout, isPending } = useCreateStripeCheckout();
  const isPurchasable = plan.plan === "PRO" || plan.plan === "BUSINESS";

  const handleCheckout = () => {
    createCheckout(
      { plan: plan.plan as Plan },
      {
        onSuccess: (response) => {
          const url = response?.data?.url;

          if (!url || !response.success) {
            triggerToast({
              type: "error",
              title: "Checkout failed",
              description: response.message || "Please try again.",
            });
            return;
          }

          window.location.assign(url);
        },
        onError: (error: FetchError) => {
          triggerToast({
            type: "error",
            title: "Checkout failed",
            description: error.data?.message || "Internal Server Error",
          });
        },
      },
    );
  };

  return (
    <Card
      className={
        highlight
          ? "flex h-full flex-col gap-6 border-primary/40 shadow-md"
          : "flex h-full flex-col gap-6"
      }
    >
      <CardHeader className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-heading text-lg font-semibold">{plan.label}</h3>
          {highlight && (
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              Popular
            </span>
          )}
        </div>
        <p className="text-3xl font-semibold tracking-tight">
          ${plan.price}
          <span className="text-sm font-normal text-muted-foreground">/mo</span>
        </p>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-3">
        <ul className="flex flex-col gap-2 text-sm">
          <li className="flex items-center gap-2">
            <IconCheck className="size-4 shrink-0 text-primary" aria-hidden />
            {formatLimit(plan.projects)} projects
          </li>
          <li className="flex items-center gap-2">
            <IconCheck className="size-4 shrink-0 text-primary" aria-hidden />
            {formatLimit(plan.members)} members per project
          </li>
        </ul>
      </CardContent>

      <CardFooter>
        {isPurchasable ? (
          <Button
            type="button"
            className="w-full"
            disabled={isPending}
            onClick={handleCheckout}
          >
            {isPending && <Spinner />}
            <IconCreditCard aria-hidden />
            Choose {plan.label}
          </Button>
        ) : (
          <p className="w-full text-center text-sm text-muted-foreground">
            Your current default plan
          </p>
        )}
      </CardFooter>
    </Card>
  );
}
