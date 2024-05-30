import { z } from "zod";

export const createPostSchema = z.object({
  created_from_theme: z.string(),
  industry_name: z.string(),
  discussion_topic: z.string(),
  topic_description: z.string(),
  mapping_id: z.number(),
  schedule_date: z.string().datetime(),
  schedule_id: z.number().optional(),
});

export type CreatePostSchema = z.infer<typeof createPostSchema>;

export const updatePostSchema = z.object({
  id: z.string().min(1),
  approved: z.boolean().optional(),
  content: z.string().optional(),
  title: z.string().optional(),
});

export const deletePostSchema = z.object({
  id: z.string().min(1),
});
