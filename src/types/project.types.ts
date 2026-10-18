/**
 * Project domain types — NEW in Phase 05 (plan.md §6.3, §9 Projects).
 *
 * `ProjectStatus` is re-exported from `analytics.types.ts` (Phase 04) so the
 * single declaration keeps both domains aligned — a second declaration would
 * collide through the `export *` barrel in `types/index.ts`.
 */

import type { ProjectStatus } from "./analytics.types";
import type { TaskOrbitRole } from "./user.types";

export type { ProjectStatus };

/** Canonical status list, ordered for selects/badges. */
export const PROJECT_STATUSES = [
  "PLANNING",
  "ACTIVE",
  "ON_HOLD",
  "COMPLETED",
  "ARCHIVED",
] as const satisfies readonly ProjectStatus[];

export type InvitationStatus = "PENDING" | "ACCEPTED" | "DECLINED" | "EXPIRED";

/** Compact user nest shared by `owner` / `member.user` / `invited_by`. */
export interface ProjectUserSummary {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  role: TaskOrbitRole | null;
}

export interface ProjectCounts {
  tasks: number;
  members: number;
}

/** List-item shape — GET /projects (plan.md §6.3 project row). */
export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  start_date: string;
  end_date: string | null;
  owner: ProjectUserSummary;
  _count: ProjectCounts;
}

export interface ProjectMember {
  id: string;
  joined_at: string;
  user: ProjectUserSummary;
}

/** Full detail shape — GET /projects/:id (adds members + timestamps). */
export interface ProjectDetail extends Project {
  owner_id: string;
  created_at: string;
  updated_at: string;
  members: ProjectMember[];
}

export interface InvitationProjectSummary {
  id: string;
  name: string;
  status: ProjectStatus;
  owner: ProjectUserSummary;
}

export interface Invitation {
  id: string;
  email: string;
  status: InvitationStatus;
  expires_at: string;
  project: InvitationProjectSummary;
  invited_by: ProjectUserSummary;
  /**
   * DEVIATION D-8: plan.md §9 requires `{token}` for accept/decline but the
   * §6.3 invitation shape omits it — typed optional so the UI degrades
   * gracefully if the backend never returns it.
   */
  token?: string;
}

/** Query params — GET /projects?page&limit&search&status&sortBy&sortOrder. */
export interface ProjectsQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: ProjectStatus;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/** Body — POST /projects (`name`, `start_date` required; rest nullable). */
export interface CreateProjectPayload {
  name: string;
  description?: string | null;
  start_date: string;
  end_date?: string | null;
  status?: ProjectStatus;
}

/** Body — PATCH /projects/:id (every field optional). */
export type UpdateProjectPayload = Partial<CreateProjectPayload>;
