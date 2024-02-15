import { z } from "zod";
import { getMaxLengthMessage, getMinLengthMessage, slugSchema } from "./common";

export const blogSchema = z.object({
  name: z
    .string()
    .min(1, getMinLengthMessage(1))
    .max(32, getMaxLengthMessage(32)),
  description: z.string().max(160, getMaxLengthMessage(160)),
  slug: slugSchema,
});

export const createBlogSchema = blogSchema.extend({
  image: z.string().optional(),
});

export const updateBlogSchema = blogSchema
  .extend({
    image: z.string().nullable(),
  })
  .partial();
