/**
 * Task domain types — NEW in Phase 06 (plan.md §6.3, §9 Tasks).
 *
 * `TaskStatus` is re-exported from `analytics.types.ts` (Phase 04) so the
 * single declaration keeps both domains aligned — a second declaration would
 * collide through the `export *` barrel in `types/index.ts` (same pattern as
 * Phase-05 `ProjectStatus`).
 */

import type { ProjectStatus, TaskStatus } from "./analytics.types";

export type { TaskStatus };

/** Canonical status list, ordered for board columns / selects / badges. */
export const TASK_STATUSES = [
  "TODO",
  "IN_PROGRESS",
  "IN_REVIEW",
  "DONE",
] as const satisfies readonly TaskStatus[];

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

/** Canonical priority list, ordered for selects / badges. */
export const TASK_PRIORITIES = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "URGENT",
] as const satisfies readonly TaskPriority[];

/** Compact user nest shared by `assignee` / `created_by`. */
export interface TaskUserSummary {
  id: string;
  name: string;
  avatar_url: string | null;
}

export interface TaskCounts {
  comments: number;
}

/** List-item shape — GET /tasks and GET /tasks/board (plan.md §6.3 task row). */
export interface TaskListItem {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  labels: string[];
  position: number;
  project_id: string;
  assignee_id: string | null;
  created_by_id: string;
  created_at: string;
  updated_at: string;
  assignee: TaskUserSummary | null;
  /**
   * Owning project nest. Present on list responses (GET /tasks) so the
   * cross-project "my tasks" view can show which project a task belongs to.
   */
  project?: TaskProjectSummary;
  _count: TaskCounts;
}

/** Project nest returned on the task detail (`GET /tasks/:id`). */
export interface TaskProjectSummary {
  id: string;
  name: string;
  status: ProjectStatus;
}

/** Full detail shape — GET /tasks/:id (adds creator + project nest). */
export interface TaskDetail extends TaskListItem {
  created_by: TaskUserSummary;
  project: TaskProjectSummary;
}

/**
 * Shape returned by `GET /tasks/board?projectId=` — one task array per
 * Kanban column (plan.md §6.3 board; exactly 4 columns).
 */
export interface Board {
  TODO: TaskListItem[];
  IN_PROGRESS: TaskListItem[];
  IN_REVIEW: TaskListItem[];
  DONE: TaskListItem[];
}

/**
 * Query params — GET /tasks. `projectId` is optional: when omitted the backend
 * returns the caller's own assignments across every project they can access.
 */
export interface TasksQuery {
  projectId?: string;
  page?: number;
  limit?: number;
  search?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string;
  dueBefore?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/** Body — POST /tasks (`projectId` required; rest optional). */
export interface CreateTaskPayload {
  projectId: string;
  title: string;
  description?: string | null;
  priority?: TaskPriority;
  due_date?: string | null;
  labels?: string[];
  assigneeId?: string | null;
}

/**
 * Body — PATCH /tasks/:id. Every field optional; `status` is DELIBERATELY
 * EXCLUDED (column moves go through PATCH /tasks/:id/status only) and
 * `projectId` cannot change.
 */
export interface UpdateTaskPayload {
  title?: string;
  description?: string | null;
  priority?: TaskPriority;
  due_date?: string | null;
  labels?: string[];
  assigneeId?: string | null;
}

/** Body — PATCH /tasks/:id/status (guard: auth; ADMIN blocked by backend). */
export interface StatusPayload {
  status: TaskStatus;
}

/** Body — PATCH /tasks/:id/assign (guard: PM; `null` clears the assignee). */
export interface AssignPayload {
  assigneeId: string | null;
}
