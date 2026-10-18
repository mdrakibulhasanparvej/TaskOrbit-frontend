import z from "zod";

/** Mirrors the TaskOrbit project status enum (plan.md §6.3). */
export const projectStatusSchema = z.enum([
  "PLANNING",
  "ACTIVE",
  "ON_HOLD",
  "COMPLETED",
  "ARCHIVED",
]);

/** Body of POST /projects — `name` and `start_date` required (plan.md §9). */
export const createProjectSchema = z.object({
  name: z
    .string("Project name must be a string")
    .min(1, "Project name is required")
    .max(100, "Project name must be less than 100 characters"),
  description: z.string().nullish(),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().nullish(),
  status: projectStatusSchema.optional(),
});

/** Body of PATCH /projects/:id — every field optional. */
export const updateProjectSchema = createProjectSchema.partial();

/** Body of POST /projects/:id/invitations. */
export const inviteMemberSchema = z.object({
  email: z
    .string("Email must be a string")
    .min(1, "Email is required")
    .email("Please provide a valid email"),
});

export type InviteMemberValues = z.infer<typeof inviteMemberSchema>;
