import type { Metadata } from "next";
import PaymentHistory from "@/components/modules/payment/PaymentHistory";

export const metadata: Metadata = {
  title: "Payment History | TaskOrbit",
};

/**
 * PM payment-history page (plan.md §10 step 16) — consumes the Phase 04
 * `useGetPaymentHistory` hook (P2, `GET /payments/history`). PM-only by the
 * `(dashboard)/project-manager` layout.
 */
export default function PaymentHistoryPage() {
  return <PaymentHistory />;
}
