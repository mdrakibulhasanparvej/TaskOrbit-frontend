import z from "zod";

/** Body of PATCH /admin/users/:id/status — backend `updateUserStatusSchema`. */
export const adminUpdateUserStatusSchema = z.object(
  {
    user_status: z.enum(["ACTIVE", "SUSPENDED"], {
      error: "user_status must be ACTIVE or SUSPENDED",
    }),
  },
  "Please provide a valid object",
);

/** Body of PATCH /admin/users/:id/role — backend `updateUserRoleSchema`. */
export const adminUpdateUserRoleSchema = z.object(
  {
    role: z.enum(["ADMIN", "PROJECT_MANAGER", "TEAM_MEMBER", "CLIENT"], {
      error: "role must be ADMIN, PROJECT_MANAGER, TEAM_MEMBER or CLIENT",
    }),
  },
  "Please provide a valid object",
);

/**
 * Body of PATCH /admin/settings — backend `updateSettingsSchema`: all fields
 * optional, but at least one must be present.
 */
export const adminUpdateSettingsSchema = z
  .object(
    {
      maintenance_mode: z.boolean().optional(),
      registration_open: z.boolean().optional(),
      support_email: z.email("Invalid email format").optional(),
    },
    "Please provide a valid object",
  )
  .refine(
    (payload) =>
      payload.maintenance_mode !== undefined ||
      payload.registration_open !== undefined ||
      payload.support_email !== undefined,
    { message: "Provide at least one setting to update" },
  );

export type AdminUpdateUserStatusValues = z.output<
  typeof adminUpdateUserStatusSchema
>;

export type AdminUpdateUserRoleValues = z.output<
  typeof adminUpdateUserRoleSchema
>;

export type AdminUpdateSettingsValues = z.output<
  typeof adminUpdateSettingsSchema
>;
