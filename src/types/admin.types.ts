/**
 * Admin domain types — NEW in Phase 08 (plan.md §9 Admin).
 *
 * Backend source of truth: `taskorbit-backend/src/app/modules/admin/*`
 * (`adminUserSelect` / `adminProjectSelect` / `getReports` / platform
 * settings) + `paymentSelect` for payments.
 *
 * NOTE: the backend `UserStatus` enum is `ACTIVE | SUSPENDED` — it is NOT the
 * legacy frontend `UserStatus` (`ACTIVE | BAN`, kept for Class C in
 * `user.types.ts`), so this file declares its own `AdminUserStatus`.
 */

import type { Meta } from "./api.types";
import type { TaskOrbitPaymentRow } from "./payment.types";
import type { ProjectStatus, ProjectUserSummary } from "./project.types";
import type { TaskOrbitRole } from "./user.types";

/** Backend `UserStatus` enum (Prisma `enum.prisma`). */
export type AdminUserStatus = "ACTIVE" | "SUSPENDED";

/** Row of GET /admin/users (ADMIN only) — `adminUserSelect`. */
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  role: TaskOrbitRole;
  user_status: AdminUserStatus;
  is_active: boolean;
  is_verified: boolean;
  last_login_at: string | null;
  created_at: string;
  _count: { owned_projects: number; assigned_tasks: number };
}

/** Body of PATCH /admin/users/:id/status. */
export interface AdminUpdateUserStatusPayload {
  user_status: AdminUserStatus;
}

/** Body of PATCH /admin/users/:id/role. */
export interface AdminUpdateUserRolePayload {
  role: TaskOrbitRole;
}

/** Row of GET /admin/projects — `adminProjectSelect` (same nest as §6.3). */
export interface AdminProject {
  id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  start_date: string;
  end_date: string | null;
  owner_id: string;
  created_at: string;
  updated_at: string;
  owner: ProjectUserSummary;
  _count: { tasks: number; members: number };
}

/** Row of GET /admin/payments — identical to the P2 history row (§6.2). */
export type AdminPayment = TaskOrbitPaymentRow;

/** Audit trail row inside GET /admin/reports (`auditLogs.data`). */
export interface AdminAuditLog {
  id: string;
  actor_id: string | null;
  actor_name: string | null;
  actor_role: TaskOrbitRole | null;
  /** Dotted verb, e.g. "project.created", "user.suspended". */
  action: string;
  entity: string;
  entity_id: string | null;
  meta: unknown;
  created_at: string;
}

/** `data` of GET /admin/reports (plan.md §6.3 admin reports shape). */
export interface AdminReportsResponse {
  auditLogs: { data: AdminAuditLog[]; meta: Meta };
  totals: { users: number; projects: number; tasks: number; payments: number };
  topProjects: AdminProject[];
}

/** `data` of GET/PATCH /admin/settings (backend `IPlatformSettings`). */
export interface PlatformSettings {
  maintenance_mode: boolean;
  registration_open: boolean;
  support_email: string;
}

/** Body of PATCH /admin/settings — all fields optional, ≥1 required. */
export interface AdminUpdateSettingsPayload {
  maintenance_mode?: boolean;
  registration_open?: boolean;
  support_email?: string;
}
