import { z } from "zod";


export const createIndustrySchema = z.object({
    industry_name: z
    .string(),
    discussion_topic: z.string(),
    topic_description: z.string()
});

export type CreateIndustrySchema = z.infer<typeof createIndustrySchema>;

export const updateIndustrySchema = createIndustrySchema.extend({
  id: z.string().min(1),
});

export const deleteIndustrySchema = z.object({
  id: z.string().min(1),
});
