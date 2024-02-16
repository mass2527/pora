import { z } from "zod";
import { getMinLengthMessage, slugSchema } from "./common";

const categorySchema = z.object({
  name: z.string().min(1, getMinLengthMessage(1)),
  slug: slugSchema,
});

export const createCategorySchema = categorySchema;

export const updateCategorySchema = categorySchema.partial();

export const updateCategoriesSchema = z.array(
  z.object({
    id: z.string(),
    orderIndex: z.coerce.number(),
  })
);
