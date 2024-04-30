import { z } from "zod";

export const createPostSchema = z.object({
  theme_name: z.string(),
  industry_name: z.string(),
  discussion_topic: z.string(),
  topic_description: z.string(),
});

export type CreatePostSchema = z.infer<typeof createPostSchema>;

export const updatePostSchema = createPostSchema.extend({
  id: z.string().min(1),
});

export const deletePostSchema = z.object({
  id: z.string().min(1),
});
