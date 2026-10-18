import z from "zod";

/**
 * Purchasable checkout plans — FREE is never sellable (plan.md §5 P1, backend
 * `createCheckoutSchema`). Mirrors the TaskOrbit `Plan` enum minus FREE.
 */
export const checkoutPlanSchema = z.enum(["PRO", "BUSINESS"]);

/** Body of POST /payments/checkout. */
export const paymentCheckoutSchema = z.object(
  {
    plan: checkoutPlanSchema,
  },
  "Please provide a valid object",
);
