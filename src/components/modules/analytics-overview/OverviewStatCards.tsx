import {
  IconCurrencyDollar,
  IconFolders,
  IconSubtask,
  IconUsers,
} from "@tabler/icons-react";
import { Card, CardContent } from "@/components/ui/card";
import type { AdminAnalytics } from "@/types";
import { formatCurrency, numberFormatter } from "./overview-utils";

function StatCard({
  label,
  value,
  caption,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  caption: string;
  icon: typeof IconUsers;
  accent: string;
}) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">
            {value}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{caption}</p>
        </div>
        <div
          className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${accent}`}
        >
          <Icon className="size-5" aria-hidden="true" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function OverviewStatCards({
  analytics,
}: {
  analytics: AdminAnalytics;
}) {
  const { totals } = analytics;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Users"
        value={numberFormatter.format(totals.users)}
        caption="Registered accounts"
        icon={IconUsers}
        accent="bg-chart-1/10 text-chart-1"
      />
      <StatCard
        label="Active projects"
        value={numberFormatter.format(totals.activeProjects)}
        caption="Every project that isn't archived"
        icon={IconFolders}
        accent="bg-chart-2/10 text-chart-2"
      />
      <StatCard
        label="Tasks"
        value={numberFormatter.format(totals.tasks)}
        caption="Across every project"
        icon={IconSubtask}
        accent="bg-chart-3/10 text-chart-3"
      />
      <StatCard
        label="MRR"
        value={formatCurrency(totals.mrr)}
        caption={`${numberFormatter.format(totals.paidSubscriptions)} paid subscriptions`}
        icon={IconCurrencyDollar}
        accent="bg-chart-4/10 text-chart-4"
      />
    </div>
  );
}
