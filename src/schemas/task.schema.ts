import z from "zod";

/** Mirrors the TaskOrbit task status enum (plan.md §6.3). */
export const taskStatusSchema = z.enum([
  "TODO",
  "IN_PROGRESS",
  "IN_REVIEW",
  "DONE",
]);

/** Mirrors the TaskOrbit task priority enum (plan.md §6.3). */
export const taskPrioritySchema = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);

const LABELS_MAX_COUNT = 10;
const LABEL_MAX_LENGTH = 30;

/** Body of POST /tasks — `projectId` and `title` required (plan.md §9). */
export const createTaskSchema = z.object({
  projectId: z.string("Project is required").min(1, "Project is required"),
  title: z
    .string("Task title is required")
    .trim()
    .min(1, "Task title can't be empty")
    .max(200, "Task title can't be more than 200 characters"),
  description: z
    .string("Description must be text")
    .max(5000, "Description can't be more than 5000 characters")
    .nullish(),
  priority: taskPrioritySchema.optional(),
  due_date: z.string("Due date must be a date").nullish(),
  labels: z
    .array(
      z
        .string("Labels must be text")
        .trim()
        .min(1, "Labels can't contain empty values")
        .max(
          LABEL_MAX_LENGTH,
          `A label can't be more than ${LABEL_MAX_LENGTH} characters`,
        ),
    )
    .max(LABELS_MAX_COUNT, `You can add up to ${LABELS_MAX_COUNT} labels`)
    .optional(),
  assigneeId: z.string("Assignee must be a user id").nullish(),
});

/**
 * Body of PATCH /tasks/:id — every field optional; `status` and `projectId`
 * deliberately excluded (status moves have their own endpoint and the
 * project can't change).
 */
export const updateTaskSchema = createTaskSchema
  .omit({ projectId: true })
  .partial();

/** Body of PATCH /tasks/:id/status (ADMIN blocked by the backend). */
export const taskStatusPayloadSchema = z.object({
  status: taskStatusSchema,
});

export type CreateTaskValues = z.infer<typeof createTaskSchema>;
export type UpdateTaskValues = z.infer<typeof updateTaskSchema>;
