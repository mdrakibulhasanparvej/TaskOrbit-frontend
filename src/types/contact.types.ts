/**
 * Contact domain types — NEW in Phase 08 (plan.md §9 Contact).
 *
 * Backend source of truth: `taskorbit-backend/src/app/modules/contact/*`
 * (`contactSelect` + `ContactStatus` Prisma enum).
 */

/** Backend `ContactStatus` enum (Prisma `enum.prisma`). */
export type ContactStatus = "NEW" | "READ" | "RESOLVED";

/** Canonical status list, ordered for selects/badges. */
export const CONTACT_STATUSES = ["NEW", "READ", "RESOLVED"] as const;

/** Row of POST /contact and GET /contact (`contactSelect`). */
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: ContactStatus;
  created_at: string;
  updated_at: string;
}

/** Body of POST /contact (public form — backend `createContactSchema`). */
export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/** Body of PATCH /contact/:id (admin status update). */
export interface ContactStatusPayload {
  status: ContactStatus;
}
