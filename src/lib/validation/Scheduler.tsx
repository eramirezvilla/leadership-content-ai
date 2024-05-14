import { z } from "zod";

export const createScheduleSchema = z.object({
    title: z.string(),
    item_type: z.string(),
    start_from: z.date(),
    end_on: z.date(),
    frequency: z.array(z.boolean()).length(7)
});

export type CreateScheduleSchema = z.infer<typeof createScheduleSchema>;

export const updateScheduleSchema = createScheduleSchema.extend({
  id: z.string().min(1),
});

export const deleteScheduleSchema = z.object({
  id: z.string().min(1),
});
