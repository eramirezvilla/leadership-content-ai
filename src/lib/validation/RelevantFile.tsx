import { z } from "zod";

export const getRelevantFilesSchema = z.object({
  ids: z.string().min(1),
});
