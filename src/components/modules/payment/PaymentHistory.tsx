"use client";

import { IconRefresh } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { useGetPaymentHistory } from "@/hooks";
import PaymentCard from "./PaymentCard";
import PaymentHistorySkeleton from "./PaymentHistorySkeleton";

export default function PaymentHistory() {
  const { data, isLoading, isError, refetch } = useGetPaymentHistory();
  const payments = data?.data ?? [];

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <header>
        <h1 className="font-heading text-2xl font-semibold sm:text-3xl">
          Payment history
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Review your payment status, transaction details, and receipts.
        </p>
      </header>

      {isLoading ? (
        <PaymentHistorySkeleton />
      ) : isError ? (
        <div className="rounded-xl border bg-card px-6 py-12 text-center">
          <p className="font-medium">Couldn&apos;t load payment history.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Check your connection and try again.
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={() => void refetch()}
          >
            <IconRefresh aria-hidden="true" />
            Try again
          </Button>
        </div>
      ) : payments.length === 0 ? (
        <div className="rounded-xl border bg-card px-6 py-12 text-center">
          <p className="font-medium">No payments yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Your subscription payments will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {payments.map((payment) => (
            <PaymentCard key={payment.payment_id} payment={payment} />
          ))}
        </div>
      )}
    </section>
  );
}
