import { z } from "zod";
import { getMinLengthMessage, slugSchema } from "./common";

const blogCategorySchema = z.object({
  name: z.string().min(1, getMinLengthMessage(1)),
  slug: slugSchema,
});

export const createBlogCategorySchema = blogCategorySchema;

export const updateBlogCategorySchema = blogCategorySchema.partial();

export const updateBlogCategoriesSchema = z.array(
  z.object({
    id: z.string(),
    orderIndex: z.coerce.number(),
  })
);
