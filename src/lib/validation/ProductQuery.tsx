import { z } from "zod";

export const getRelevantProducts = z.object({
  sku: z.string().max(7).optional(),
  part_number: z.string().max(20).optional(),
  chatQuery: z.string().optional(),
});

const productSchema = z.object({
    sku: z.string(),
    part_number: z.string(),
    description: z.string(),
    });

export type GetRelevantProducts = z.infer<typeof productSchema>;