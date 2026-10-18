import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { AdminAnalytics } from "@/types";
import ChartCard from "./ChartCard";
import { signupsChartConfig } from "./chart-config";
import { formatMonth, numberFormatter } from "./overview-utils";

export default function MonthlySignupsChart({
  analytics,
}: {
  analytics: AdminAnalytics;
}) {
  const data = analytics.monthlySignups.map((point) => ({
    month: formatMonth(point.month),
    signups: point.signups,
  }));

  return (
    <ChartCard
      title="Monthly signups"
      description="New accounts over the last 12 months"
    >
      <ChartContainer config={signupsChartConfig} className="h-64 w-full">
        <BarChart
          accessibilityLayer
          data={data}
          margin={{ left: 8, right: 8, top: 12, bottom: 8 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value: number) => numberFormatter.format(value)}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                formatter={(value) => numberFormatter.format(Number(value))}
              />
            }
          />
          <Bar
            dataKey="signups"
            fill="var(--color-signups)"
            radius={[6, 6, 0, 0]}
            maxBarSize={48}
          />
        </BarChart>
      </ChartContainer>
    </ChartCard>
  );
}
