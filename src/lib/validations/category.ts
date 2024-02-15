import { z } from "zod";
import { slugSchema } from "./common";

export const categorySchema = z.object({
  name: z.string().min(1, "최소 1글자 이상 입력해 주세요."),
  slug: slugSchema,
});

export const createBlogCategorySchema = z.object({
  name: z.string().min(1, "최소 1글자 이상 입력해 주세요."),
  slug: slugSchema,
});

export const updateBlogCategorySchema = z.object({
  name: z.string().min(1, "최소 1글자 이상 입력해 주세요.").optional(),
  slug: slugSchema.optional(),
});

export const updateBlogCategoriesSchema = z.array(
  z.object({
    id: z.string(),
    orderIndex: z.coerce.number(),
  })
);
