import { z } from "zod";

export const createScheduleSchema = z.object({
    title: z.string().optional(),
    item_type: z.number(),
    start_from: z.date().default(() => new Date()),
    end_on: z.date().optional(),
    frequency: z.array(z.boolean()).length(7)
});

export type CreateScheduleSchema = z.infer<typeof createScheduleSchema>;

export const updateScheduleSchema = createScheduleSchema.extend({
  id: z.string().min(1),
});

export const deleteScheduleSchema = z.object({
  id: z.string().min(1),
});
