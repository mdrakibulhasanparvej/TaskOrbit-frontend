import z from "zod";

export const userProfileUpdateSchema = z.object({
  name: z.string("Name must be text").trim().optional(),
});
