import { z } from 'zod';

export const taskSchema = z.object({
  text: z.string().min(1, { message: "Title is mandatory" }),
  deadline: z.string(),
  completed: z.boolean().default(false),
  notified: z.boolean().default(false),
});
