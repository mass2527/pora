import { z } from "zod";
import { slugStringSchema } from "./common";

export const categorySchema = z.object({
  name: z.string().min(1, "최소 1글자 이상 입력해 주세요."),
  slug: slugStringSchema,
});

export const createBlogCategorySchema = z.object({
  name: z.string().min(1, "최소 1글자 이상 입력해 주세요."),
  slug: slugStringSchema,
});

export const updateBlogCategorySchema = z.object({
  name: z.string().min(1, "최소 1글자 이상 입력해 주세요.").optional(),
  slug: slugStringSchema.optional(),
});

export const updateBlogCategoriesSchema = z.array(
  z.object({
    id: z.string(),
    orderIndex: z.coerce.number(),
  })
);
