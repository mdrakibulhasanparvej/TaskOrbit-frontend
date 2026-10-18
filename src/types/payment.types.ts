export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";
export type PaymentGateway = "STRIPE" | "SSLCOMMERZ" | "BKASH";

export interface Payment {
  course_details_id: number;
  payment_id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  payment_gateway: PaymentGateway;
  transaction_id: string | null;
  institution_id: number;
  student_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface PaymentDetailsResponse extends Payment {
  course: {
    title: string;
    batch: string;
    semester: string;
    start_date: Date | null;
    end_date: Date | null;
  };
}

// ─────────────────────────────────────────────────────────────────
// TaskOrbit subscription-billing types — ADDITIVE (Phase 01, finalized
// in Phase 04). Consumed by the payment reshape (plan.md §5 P1–P5, §6.2/§6.3).
// The legacy `Payment` / `PaymentDetailsResponse` above stay untouched for
// Class C code; the new backend shapes live below.
// ─────────────────────────────────────────────────────────────────

/** Checkout plan options (POST /payments/checkout body). FREE is never purchasable. */
export type Plan = "PRO" | "BUSINESS";

/** Every tier the backend knows about, including the implicit FREE plan. */
export type SubscriptionPlan = "FREE" | Plan;

export type SubscriptionStatus =
  | "ACTIVE"
  | "CANCELLED"
  | "EXPIRED"
  | "PAST_DUE";

/** Row returned by GET /payments/plans (public pricing page). `null` = unlimited. */
export interface PlanInfo {
  plan: SubscriptionPlan;
  label: string;
  price: number;
  projects: number | null;
  members: number | null;
}

/**
 * `data` of GET /payments/subscription (auth, PM). Dates are ISO strings from
 * JSON; `status` is `null` when the owner has never subscribed (plan.md §5 P4).
 */
export interface Subscription {
  plan: SubscriptionPlan;
  label: string;
  price: number;
  status: SubscriptionStatus | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  limits: { projects: number | null; members: number | null };
  usage: { projects: number; members: number };
}

/** Body of POST /payments/checkout. */
export interface CheckoutPayload {
  plan: Plan;
}

/** `data` of POST /payments/checkout — `url` is the Stripe hosted page. */
export interface TaskOrbitCheckoutData {
  url: string;
  plan: Plan;
  amount: number;
}

/** `data` of GET /payments/verify?session_id= (auth, PM). */
export interface PaymentVerification {
  plan: Plan;
  amount: number;
  transactionId: string | null;
  status: PaymentStatus;
}

/**
 * Raw TaskOrbit payment row from GET /payments/history — no `course` nest
 * (plan.md §6.2). `owner` replaces the legacy `institution_id`/`student_id`.
 */
export interface TaskOrbitPaymentRow {
  id: string;
  plan: Plan;
  amount: number;
  currency: string;
  status: PaymentStatus;
  payment_gateway: PaymentGateway;
  transaction_id: string | null;
  created_at: string;
  updated_at: string;
  owner: { id: string; name: string; email: string };
}

/**
 * Adapted history row consumed by PaymentCard/PaymentHistory: the raw row with
 * `id` renamed to the legacy `payment_id` and no `course` block (plan.md §5 P2).
 */
export type PaymentRow = Omit<TaskOrbitPaymentRow, "id"> & {
  payment_id: string;
};
