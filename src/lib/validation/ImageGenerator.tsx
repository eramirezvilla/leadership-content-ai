import { z } from "zod";

export const genImageSchema = z.object({
  id: z.string(),
  post_content: z.string(),
});

export type GenImageSchema = z.infer<typeof genImageSchema>;