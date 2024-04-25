import { z } from "zod";

export const createIndustrySchema = z.object({
    industry_name: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" })
    .optional(),
    discussion_topic: z.string().optional(),
    topic_description: z.string().optional(),
});

export type CreateIndustrySchema = z.infer<typeof createIndustrySchema>;

export const updateIndustrySchema = createIndustrySchema.extend({
  id: z.string().min(1),
});
export const deleteIndustrySchema = z.object({
  id: z.string().min(1),
});
