import { z } from "zod";

export const genImageSchema = z.object({
  post_content: z.string(),
});

export type GenImageSchema = z.infer<typeof genImageSchema>;