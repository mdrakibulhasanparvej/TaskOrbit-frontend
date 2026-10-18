import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { AdminAnalytics } from "@/types";
import ChartCard from "./ChartCard";
import { revenueChartConfig } from "./chart-config";
import { formatCurrency, formatMonth, numberFormatter } from "./overview-utils";

export default function MonthlyRevenueChart({
  analytics,
}: {
  analytics: AdminAnalytics;
}) {
  const data = analytics.monthlyRevenue.map((point) => ({
    month: formatMonth(point.month),
    revenue: point.revenue,
  }));

  return (
    <ChartCard
      title="Monthly revenue"
      description="Successful payments over the last 12 months"
    >
      <ChartContainer config={revenueChartConfig} className="h-64 w-full">
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
                formatter={(value) => formatCurrency(Number(value))}
              />
            }
          />
          <Bar
            dataKey="revenue"
            fill="var(--color-revenue)"
            radius={[6, 6, 0, 0]}
            maxBarSize={48}
          />
        </BarChart>
      </ChartContainer>
    </ChartCard>
  );
}
