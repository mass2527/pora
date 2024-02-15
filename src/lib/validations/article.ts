import { ArticleStatus } from "@prisma/client";
import { z } from "zod";
import { slugSchema, stringSchema } from "./common";

export const blogArticleSchema = z.object({
  categoryId: stringSchema.uuid().optional(),
  slug: slugSchema,
  title: stringSchema,
  draftTitle: stringSchema,
  description: stringSchema,
  jsonContent: z.string(),
  draftJsonContent: z.string(),
  htmlContent: z.string(),
  status: z.nativeEnum(ArticleStatus),
});

export const createBlogArticleSchema = blogArticleSchema;

export const updateBlogArticleSchema = blogArticleSchema
  .extend({
    image: z.string().nullish(),
  })
  .partial();
