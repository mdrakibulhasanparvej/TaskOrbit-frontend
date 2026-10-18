import type { Metadata } from "next";
import AdminPaymentTable from "@/components/modules/admin/AdminPaymentTable";

export const metadata: Metadata = {
  title: "Payments | TaskOrbit Admin",
};

/** Admin payments oversight — GET /admin/payments (all users). */
export default function AdminPaymentsPage() {
  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <header>
        <h1 className="font-heading text-2xl font-semibold sm:text-3xl">
          Payments
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Subscription payments across the platform.
        </p>
      </header>
      <AdminPaymentTable />
    </section>
  );
}
