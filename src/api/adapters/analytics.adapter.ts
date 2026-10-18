/**
 * Analytics response adapters — TaskOrbit DTO → canonical frontend shape.
 * Pure functions only (plan.md §7): no network access, no React, no side effects.
 *
 * The raw TaskOrbit payload already follows the new dashboard shape; the
 * adapters normalise it (missing arrays/numbers, a stable four-status task
 * axis) so the new `analytics-overview/*` components never have to defend
 * against partial data (plan.md §5 N1).
 */

import type {
  AdminAnalytics,
  AnalyticsStatusCount,
  AnalyticsWorkloadRow,
  ApiResponse,
  ManagerAnalytics,
  MemberAnalytics,
  MonthlyRevenuePoint,
  MonthlySignupPoint,
  OverdueTrendBucket,
  ProjectAnalytics,
  ProjectStatus,
  TaskOrbitAdminAnalytics,
  TaskOrbitManagerAnalytics,
  TaskOrbitMemberAnalytics,
  TaskOrbitProjectAnalytics,
  TaskStatus,
} from "@/types";

const TASK_STATUSES: TaskStatus[] = [
  "TODO",
  "IN_PROGRESS",
  "IN_REVIEW",
  "DONE",
];

const PROJECT_STATUSES: ProjectStatus[] = [
  "PLANNING",
  "ACTIVE",
  "ON_HOLD",
  "COMPLETED",
  "ARCHIVED",
];

/** Coerce to a finite number, defaulting to 0 (avoids `NaN` in the charts). */
const numberOr = (value: unknown): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

/**
 * One row per known status in a fixed order — the same stable-axis guarantee
 * the backend provides, restated so a partial payload cannot shrink a chart.
 */
const normaliseStatusCounts = <TStatus extends string>(
  rows: { status: TStatus; count: number }[] | undefined,
  statuses: readonly TStatus[],
): AnalyticsStatusCount<TStatus>[] => {
  const counts = new Map<TStatus, number>(
    (rows ?? []).map((row) => [row.status, numberOr(row.count)]),
  );

  return statuses.map((status) => ({
    status,
    count: counts.get(status) ?? 0,
  }));
};

const normaliseMonthlyRevenue = (
  rows: TaskOrbitAdminAnalytics["monthlyRevenue"] | undefined,
): MonthlyRevenuePoint[] =>
  (rows ?? []).map((row) => ({
    month: row.month,
    revenue: numberOr(row.revenue),
    payments: numberOr(row.payments),
  }));

const normaliseMonthlySignups = (
  rows: TaskOrbitAdminAnalytics["monthlySignups"] | undefined,
): MonthlySignupPoint[] =>
  (rows ?? []).map((row) => ({
    month: row.month,
    signups: numberOr(row.signups),
  }));

const normaliseWorkload = (
  rows: TaskOrbitManagerAnalytics["workload"] | undefined,
): AnalyticsWorkloadRow[] =>
  (rows ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    avatar_url: row.avatar_url ?? null,
    openTasks: numberOr(row.openTasks),
  }));

const normaliseOverdueTrend = (
  rows: TaskOrbitManagerAnalytics["overdueTrend"] | undefined,
): OverdueTrendBucket[] =>
  (rows ?? []).map((row) => ({
    week: row.week,
    overdue: numberOr(row.overdue),
  }));

/** GET /analytics/admin → canonical `AdminAnalytics` (plan.md §5 N1). */
export function adaptAdminAnalytics(
  raw: ApiResponse<TaskOrbitAdminAnalytics>,
): ApiResponse<AdminAnalytics> {
  const { data } = raw;

  if (!data) {
    return { success: raw.success, message: raw.message, meta: raw.meta };
  }

  return {
    success: raw.success,
    message: raw.message,
    meta: raw.meta,
    data: {
      totals: {
        users: numberOr(data.totals?.users),
        activeProjects: numberOr(data.totals?.activeProjects),
        tasks: numberOr(data.totals?.tasks),
        paidSubscriptions: numberOr(data.totals?.paidSubscriptions),
        mrr: numberOr(data.totals?.mrr),
      },
      monthlyRevenue: normaliseMonthlyRevenue(data.monthlyRevenue),
      monthlySignups: normaliseMonthlySignups(data.monthlySignups),
      tasksByStatus: normaliseStatusCounts(data.tasksByStatus, TASK_STATUSES),
    },
  };
}

/** GET /analytics/manager → canonical `ManagerAnalytics` (plan.md §5 N2). */
export function adaptManagerAnalytics(
  raw: ApiResponse<TaskOrbitManagerAnalytics>,
): ApiResponse<ManagerAnalytics> {
  const { data } = raw;

  if (!data) {
    return { success: raw.success, message: raw.message, meta: raw.meta };
  }

  return {
    success: raw.success,
    message: raw.message,
    meta: raw.meta,
    data: {
      totals: {
        projects: numberOr(data.totals?.projects),
        tasks: numberOr(data.totals?.tasks),
      },
      completionRate: numberOr(data.completionRate),
      tasksByStatus: normaliseStatusCounts(data.tasksByStatus, TASK_STATUSES),
      projectsByStatus: normaliseStatusCounts(
        data.projectsByStatus,
        PROJECT_STATUSES,
      ),
      workload: normaliseWorkload(data.workload),
      overdueTrend: normaliseOverdueTrend(data.overdueTrend),
    },
  };
}

/** GET /analytics/member → canonical `MemberAnalytics` (plan.md §5 N3). */
export function adaptMemberAnalytics(
  raw: ApiResponse<TaskOrbitMemberAnalytics>,
): ApiResponse<MemberAnalytics> {
  const { data } = raw;

  if (!data) {
    return { success: raw.success, message: raw.message, meta: raw.meta };
  }

  return {
    success: raw.success,
    message: raw.message,
    meta: raw.meta,
    data: {
      totals: {
        tasks: numberOr(data.totals?.tasks),
        overdue: numberOr(data.totals?.overdue),
      },
      completionRate: numberOr(data.completionRate),
      tasksByStatus: normaliseStatusCounts(data.tasksByStatus, TASK_STATUSES),
      overdueCount: numberOr(data.overdueCount),
    },
  };
}

/** GET /analytics/project/:projectId → canonical `ProjectAnalytics` (plan.md §5 N4). */
export function adaptProjectAnalytics(
  raw: ApiResponse<TaskOrbitProjectAnalytics>,
): ApiResponse<ProjectAnalytics> {
  const { data } = raw;

  if (!data) {
    return { success: raw.success, message: raw.message, meta: raw.meta };
  }

  return {
    success: raw.success,
    message: raw.message,
    meta: raw.meta,
    data: {
      project: {
        id: data.project.id,
        name: data.project.name,
        status: data.project.status,
      },
      totals: { tasks: numberOr(data.totals?.tasks) },
      completionRate: numberOr(data.completionRate),
      tasksByStatus: normaliseStatusCounts(data.tasksByStatus, TASK_STATUSES),
      workload: normaliseWorkload(data.workload),
      overdueTrend: normaliseOverdueTrend(data.overdueTrend),
    },
  };
}
