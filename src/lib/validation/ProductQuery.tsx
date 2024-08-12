import { z } from "zod";

export const getRelevantProducts = z.object({
  sku: z.string().optional(),
  part_number: z.string().optional(),
});
