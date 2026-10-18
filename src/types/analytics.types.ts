/**
 * Analytics types — NEW in Phase 04 (plan.md §5 N1–N4, §10 step 8).
 *
 * `TaskOrbit*` interfaces are the raw backend DTOs (plan.md §6.2 `overview`);
 * the bare `AdminAnalytics` / `ManagerAnalytics` / `MemberAnalytics` /
 * `ProjectAnalytics` interfaces are the canonical shapes the new
 * `analytics-overview/*` components consume. The pure-functions in
 * `src/api/adapters/analytics.adapter.ts` bridge the two.
 */

export type TaskStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";

export type ProjectStatus =
  | "PLANNING"
  | "ACTIVE"
  | "ON_HOLD"
  | "COMPLETED"
  | "ARCHIVED";

/** One bucket of a status breakdown (tasks or projects). */
export interface AnalyticsStatusCount<TStatus extends string> {
  status: TStatus;
  count: number;
}

export interface MonthlyRevenuePoint {
  /** `YYYY-MM` bucket label. */
  month: string;
  revenue: number;
  payments: number;
}

export interface MonthlySignupPoint {
  /** `YYYY-MM` bucket label. */
  month: string;
  signups: number;
}

export interface AnalyticsWorkloadRow {
  id: string;
  name: string;
  avatar_url: string | null;
  openTasks: number;
}

export interface OverdueTrendBucket {
  /** Local midnight of the bucket start, `YYYY-MM-DD`. */
  week: string;
  overdue: number;
}

// ─────────────────────────────────────────────────────────────────
// Canonical shapes (consumed by analytics-overview/* components)
// ─────────────────────────────────────────────────────────────────

export interface AdminAnalytics {
  totals: {
    users: number;
    activeProjects: number;
    tasks: number;
    paidSubscriptions: number;
    mrr: number;
  };
  monthlyRevenue: MonthlyRevenuePoint[];
  monthlySignups: MonthlySignupPoint[];
  tasksByStatus: AnalyticsStatusCount<TaskStatus>[];
}

export interface ManagerAnalytics {
  totals: { projects: number; tasks: number };
  /** Share of DONE tasks, 0..1. */
  completionRate: number;
  tasksByStatus: AnalyticsStatusCount<TaskStatus>[];
  projectsByStatus: AnalyticsStatusCount<ProjectStatus>[];
  workload: AnalyticsWorkloadRow[];
  overdueTrend: OverdueTrendBucket[];
}

export interface MemberAnalytics {
  totals: { tasks: number; overdue: number };
  /** Share of DONE tasks, 0..1. */
  completionRate: number;
  tasksByStatus: AnalyticsStatusCount<TaskStatus>[];
  overdueCount: number;
}

export interface ProjectAnalytics {
  project: { id: string; name: string; status: ProjectStatus };
  totals: { tasks: number };
  /** Share of DONE tasks, 0..1. */
  completionRate: number;
  tasksByStatus: AnalyticsStatusCount<TaskStatus>[];
  workload: AnalyticsWorkloadRow[];
  overdueTrend: OverdueTrendBucket[];
}

// ─────────────────────────────────────────────────────────────────
// Raw TaskOrbit DTOs (adapter input — plan.md §6.2 `overview`)
// ─────────────────────────────────────────────────────────────────

/** `data` of GET /analytics/admin. */
export interface TaskOrbitAdminAnalytics {
  totals: {
    users: number;
    activeProjects: number;
    tasks: number;
    paidSubscriptions: number;
    mrr: number;
  };
  monthlyRevenue: { month: string; revenue: number; payments: number }[];
  monthlySignups: { month: string; signups: number }[];
  tasksByStatus: { status: TaskStatus; count: number }[];
}

/** `data` of GET /analytics/manager. */
export interface TaskOrbitManagerAnalytics {
  totals: { projects: number; tasks: number };
  completionRate: number;
  tasksByStatus: { status: TaskStatus; count: number }[];
  projectsByStatus: { status: ProjectStatus; count: number }[];
  workload: {
    id: string;
    name: string;
    avatar_url: string | null;
    openTasks: number;
  }[];
  overdueTrend: { week: string; overdue: number }[];
}

/** `data` of GET /analytics/member. */
export interface TaskOrbitMemberAnalytics {
  totals: { tasks: number; overdue: number };
  completionRate: number;
  tasksByStatus: { status: TaskStatus; count: number }[];
  overdueCount: number;
}

/** `data` of GET /analytics/project/:projectId. */
export interface TaskOrbitProjectAnalytics {
  project: { id: string; name: string; status: ProjectStatus };
  totals: { tasks: number };
  completionRate: number;
  tasksByStatus: { status: TaskStatus; count: number }[];
  workload: {
    id: string;
    name: string;
    avatar_url: string | null;
    openTasks: number;
  }[];
  overdueTrend: { week: string; overdue: number }[];
}
