import apiClient from "@/lib/ofetch";
import type {
  ApiResponse,
  CheckoutPayload,
  PaymentVerification,
  PlanInfo,
  Subscription,
  TaskOrbitCheckoutData,
  TaskOrbitPaymentRow,
} from "@/types";
import { adaptCheckout, adaptPaymentHistoryRows } from "./adapters";

const prefix = "/payments";

/** P1 — POST /payments/checkout (subscription checkout; plan.md §5 P1). */
export const createStripeCheckout = async (payload: CheckoutPayload) => {
  const raw = await apiClient<ApiResponse<TaskOrbitCheckoutData>>(
    `${prefix}/checkout`,
    {
      method: "POST",
      body: payload,
    },
  );

  return adaptCheckout(raw);
};

/** P2 — GET /payments/history (paginated rows, no `course` nest; §5 P2). */
export const getPaymentHistory = async () => {
  const raw = await apiClient<ApiResponse<TaskOrbitPaymentRow[]>>(
    `${prefix}/history`,
  );

  return adaptPaymentHistoryRows(raw);
};

/** P3 — GET /payments/plans (public pricing table; §5 P3). */
export const getPlans = () => {
  return apiClient<ApiResponse<PlanInfo[]>>(`${prefix}/plans`);
};

/** P4 — GET /payments/subscription (auth, PM; §5 P4). */
export const getMySubscription = () => {
  return apiClient<ApiResponse<Subscription>>(`${prefix}/subscription`);
};

/** P5 — GET /payments/verify?session_id= (auth, PM; §5 P5). */
export const verifyPayment = (sessionId: string) => {
  return apiClient<ApiResponse<PaymentVerification>>(`${prefix}/verify`, {
    query: { session_id: sessionId },
  });
};
