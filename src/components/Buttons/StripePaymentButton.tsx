"use client";
import { IconCreditCard } from "@tabler/icons-react";
import type { FetchError } from "ofetch";
import { useCreateStripeCheckout } from "@/hooks";
import type { Plan } from "@/types";
import triggerToast from "@/utils/triggerToast";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

/** Legacy stub — unused at runtime; kept only so Class C callers type-check. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CourseDetails = Record<string, any>;


/**
 * Subscription checkout trigger. Phase 04 replaces the legacy course purchase
 * with a plan purchase (plan.md §5 P1). `courseDetails` is kept only as an
 * optional, ignored legacy prop so the frozen Class C course-details caller
 * (`StudentCourseDetails`, never rendered) still type-checks — it is unused.
 */
type StripePaymentButtonProps = {
  plan?: Plan;
  courseDetails?: CourseDetails;
};

export default function StripePaymentButton({
  plan,
}: StripePaymentButtonProps) {
  const { mutate: create, isPending } = useCreateStripeCheckout();

  const handlePayment = () => {
    if (!plan) {
      triggerToast({
        type: "error",
        title: "Payment Failed",
        description: "No subscription plan selected.",
      });
      return;
    }

    create(
      { plan },
      {
        onSuccess: (res) => {
          const url = res?.data?.url;

          if (!url || !res.success) {
            triggerToast({
              type: "error",
              title: "Payment Failed",
              description: res.message || "Internal server error",
            });
            return;
          }

          window.location.assign(url);
        },
        onError: (err: FetchError<{ message?: string }>) => {
          triggerToast({
            type: "error",
            title: "Payment Failed",
            description: err.data?.message || "Internal server error",
          });
        },
      },
    );
  };

  return (
    <Button
      type="button"
      className="w-full md:col-span-2 xl:col-span-1"
      disabled={!plan || isPending}
      onClick={handlePayment}
    >
      {isPending && <Spinner />}
      <IconCreditCard aria-hidden="true" /> Pay with Stripe
    </Button>
  );
}
