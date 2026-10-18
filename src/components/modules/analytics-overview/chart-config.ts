import type { ChartConfig } from "@/components/ui/chart";

export const revenueChartConfig = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
} satisfies ChartConfig;

export const signupsChartConfig = {
  signups: { label: "Signups", color: "var(--chart-2)" },
} satisfies ChartConfig;

export const taskStatusChartConfig = {
  count: { label: "Tasks", color: "var(--chart-3)" },
} satisfies ChartConfig;
