import type { Metadata } from "next";
import PaymentHistory from "@/components/modules/payment/PaymentHistory";

export const metadata: Metadata = {
  title: "Payment History | TaskOrbit",
};

/** Client payment-history page — `GET /payments/history` (own rows). */
export default function ClientPaymentHistoryPage() {
  return <PaymentHistory />;
}
