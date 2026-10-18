/**
 * Payment response adapters — TaskOrbit DTO → legacy Edu-Matrix contract.
 * Pure functions only (plan.md §7): no network access, no React, no side effects.
 */

import type {
  ApiResponse,
  PaymentRow,
  Plan,
  TaskOrbitCheckoutData,
  TaskOrbitPaymentRow,
} from "@/types";

/**
 * Adapted `data` of POST /payments/checkout. The legacy consumer expects
 * `stripe_checkout_url` (plan.md §6.2 — `url → stripe_checkout_url`); `url`
 * is kept as an alias because the reshaped button reads `data.url`.
 */
export interface AdaptedCheckoutData {
  stripe_checkout_url: string;
  url: string;
  plan: Plan;
  amount: number;
}

export type AdaptedCheckoutResponse = ApiResponse<AdaptedCheckoutData>;

/** POST /payments/checkout → legacy `{ stripe_checkout_url, url, plan, amount }`. */
export function adaptCheckout(
  raw: ApiResponse<TaskOrbitCheckoutData>,
): AdaptedCheckoutResponse {
  const { data } = raw;

  if (!data) {
    return { success: raw.success, message: raw.message, meta: raw.meta };
  }

  return {
    success: raw.success,
    message: raw.message,
    meta: raw.meta,
    data: {
      stripe_checkout_url: data.url,
      url: data.url,
      plan: data.plan,
      amount: data.amount,
    },
  };
}

/**
 * One GET /payments/history row → the legacy `payment_id` contract (plan.md
 * §5 P2). The raw TaskOrbit row carries no `course` nest, so the legacy course
 * block is simply absent — PaymentCard drops it (Class E).
 */
export function adaptPaymentHistoryRow(row: TaskOrbitPaymentRow): PaymentRow {
  const { id, ...rest } = row;

  return { payment_id: id, ...rest };
}

/** GET /payments/history envelope → adapted `PaymentRow[]` (meta preserved). */
export function adaptPaymentHistoryRows(
  raw: ApiResponse<TaskOrbitPaymentRow[]>,
): ApiResponse<PaymentRow[]> {
  const { data } = raw;

  if (!data) {
    return { success: raw.success, message: raw.message, meta: raw.meta };
  }

  return {
    success: raw.success,
    message: raw.message,
    meta: raw.meta,
    data: data.map(adaptPaymentHistoryRow),
  };
}
