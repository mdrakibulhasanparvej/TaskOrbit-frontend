"use client";

import { IconRefresh } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import MyPagination from "@/components/shared/Pagination";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetAdminPayments } from "@/hooks";
import type { PaymentStatus, Query } from "@/types";

const PAGE_LIMIT = 10;
const ALL = "ALL";

const STATUS_STYLES: Record<PaymentStatus, string> = {
  SUCCESS: "bg-primary/10 text-primary",
  PENDING: "bg-amber-500/10 text-amber-600 dark:text-amber-500",
  FAILED: "bg-destructive/10 text-destructive",
  REFUNDED: "bg-muted text-muted-foreground",
};

/**
 * Admin payments oversight (plan.md §9 — GET /admin/payments). Read-only:
 * the backend exposes no refund/mutate endpoint for payments, so this table
 * only reports. Scope note (C14): the PM-facing payment history page uses a
 * different endpoint (`GET /payments/history`, own payments only).
 */
export default function AdminPaymentTable() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<PaymentStatus | undefined>(undefined);

  const query = useMemo<Query>(
    () => ({ page, limit: PAGE_LIMIT, status }),
    [page, status],
  );

  const { data, isLoading, isError, refetch } = useGetAdminPayments(query);
  const payments = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Every payment across the platform, newest first.
        </p>

        <Select
          value={status ?? ALL}
          onValueChange={(value) => {
            setStatus(value === ALL ? undefined : (value as PaymentStatus));
            setPage(1);
          }}
        >
          <SelectTrigger
            className="w-full sm:w-44"
            aria-label="Filter by status"
          >
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All statuses</SelectItem>
            <SelectItem value="SUCCESS">Success</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="FAILED">Failed</SelectItem>
            <SelectItem value="REFUNDED">Refunded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from(
            { length: 5 },
            (_, index) => `admin-payment-skeleton-${index}`,
          ).map((key) => (
            <div key={key} className="h-14 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-xl border bg-card px-6 py-12 text-center">
          <p className="font-medium">Couldn&apos;t load payments.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Check your connection and try again.
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={() => void refetch()}
          >
            <IconRefresh aria-hidden />
            Try again
          </Button>
        </div>
      ) : payments.length === 0 ? (
        <div className="rounded-xl border bg-card px-6 py-12 text-center">
          <p className="font-medium">No payments found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {status
              ? "Try adjusting your status filter."
              : "Payments will appear here once customers subscribe."}
          </p>
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Gateway</TableHead>
                <TableHead>Transaction</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{payment.owner.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {payment.owner.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{payment.plan}</TableCell>
                  <TableCell className="text-right">
                    {payment.amount.toFixed(2)} {payment.currency}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[payment.status]}`}
                    >
                      {payment.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {payment.payment_gateway}
                  </TableCell>
                  <TableCell className="max-w-40 truncate font-mono text-xs text-muted-foreground">
                    {payment.transaction_id ?? "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(payment.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <MyPagination
            page={page}
            totalPages={totalPages}
            handlePageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
