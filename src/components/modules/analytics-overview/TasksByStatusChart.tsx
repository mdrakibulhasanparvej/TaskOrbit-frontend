import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { AdminAnalytics, TaskStatus } from "@/types";
import ChartCard from "./ChartCard";
import { taskStatusChartConfig } from "./chart-config";
import { numberFormatter } from "./overview-utils";

const statusLabels: Record<TaskStatus, string> = {
  TODO: "To do",
  IN_PROGRESS: "In progress",
  IN_REVIEW: "In review",
  DONE: "Done",
};

export default function TasksByStatusChart({
  analytics,
}: {
  analytics: AdminAnalytics;
}) {
  const data = analytics.tasksByStatus.map((row) => ({
    status: statusLabels[row.status] ?? row.status,
    count: row.count,
  }));

  return (
    <ChartCard
      title="Tasks by status"
      description="Every task on the platform, grouped by its current status"
    >
      <ChartContainer config={taskStatusChartConfig} className="h-64 w-full">
        <BarChart
          accessibilityLayer
          data={data}
          margin={{ left: 8, right: 8, top: 12, bottom: 8 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="status"
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
            dataKey="count"
            fill="var(--color-count)"
            radius={[6, 6, 0, 0]}
            maxBarSize={64}
          />
        </BarChart>
      </ChartContainer>
    </ChartCard>
  );
}
