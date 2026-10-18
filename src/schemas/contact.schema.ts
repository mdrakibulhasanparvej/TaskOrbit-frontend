import z from "zod";

/** Mirror the backend caps (contact.schema.ts — 100/150/5000 chars). */
const NAME_MAX_LENGTH = 100;
const SUBJECT_MAX_LENGTH = 150;
const MESSAGE_MAX_LENGTH = 5000;

/** Body of POST /contact — public form (backend `createContactSchema`). */
export const createContactSchema = z.object({
  name: z
    .string("Name is required")
    .trim()
    .min(1, "Name can't be empty")
    .max(
      NAME_MAX_LENGTH,
      `Name can't be more than ${NAME_MAX_LENGTH} characters`,
    ),
  email: z.email("Invalid email format"),
  subject: z
    .string("Subject is required")
    .trim()
    .min(1, "Subject can't be empty")
    .max(
      SUBJECT_MAX_LENGTH,
      `Subject can't be more than ${SUBJECT_MAX_LENGTH} characters`,
    ),
  message: z
    .string("Message is required")
    .trim()
    .min(1, "Message can't be empty")
    .max(
      MESSAGE_MAX_LENGTH,
      `Message can't be more than ${MESSAGE_MAX_LENGTH} characters`,
    ),
});

/** Body of PATCH /contact/:id — admin status update. */
export const updateContactStatusSchema = z.object({
  status: z.enum(["NEW", "READ", "RESOLVED"], {
    error: "status must be NEW, READ or RESOLVED",
  }),
});

export type CreateContactValues = z.output<typeof createContactSchema>;
export type UpdateContactStatusValues = z.output<
  typeof updateContactStatusSchema
>;
