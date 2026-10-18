import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { PaymentRow, PaymentStatus } from "@/types";
import { formatTimestamp } from "@/utils/formatDate";

const statusStyles: Record<PaymentStatus, string> = {
  PENDING: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  SUCCESS: "bg-primary/10 text-primary",
  FAILED: "bg-destructive/10 text-destructive",
  REFUNDED: "bg-muted text-muted-foreground",
};

export default function PaymentCard({ payment }: { payment: PaymentRow }) {
  return (
    <Card className="h-full">
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="text-base">{payment.plan} plan</CardTitle>
            <CardDescription className="mt-1">
              {payment.payment_gateway}
            </CardDescription>
          </div>
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[payment.status]}`}
          >
            {payment.status}
          </span>
        </div>
        <p className="text-2xl font-semibold tracking-tight">
          {payment.amount.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{" "}
          <span className="text-base font-medium text-muted-foreground">
            {payment.currency}
          </span>
        </p>
        <CardDescription>
          Paid {formatTimestamp(new Date(payment.created_at))}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4 border-t pt-4 text-sm">
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-muted-foreground">Payment method</dt>
              <dd className="mt-1 font-medium">{payment.payment_gateway}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Account</dt>
              <dd className="mt-1 truncate font-medium">
                {payment.owner.name}
              </dd>
            </div>
          </dl>
          <div className="rounded-lg bg-muted/60 px-3 py-2.5">
            <p className="text-xs font-medium text-muted-foreground">
              Transaction ID
            </p>
            <p className="mt-1 break-all font-mono text-xs">
              {payment.transaction_id || "Not available"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
