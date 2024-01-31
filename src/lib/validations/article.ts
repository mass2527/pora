import { z } from "zod";

export const articleSchema = z.object({
  categoryId: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  content: z.string().min(1),
});
