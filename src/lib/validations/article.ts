import { ArticleStatus } from "@prisma/client";
import { z } from "zod";
import { slugSchema, stringSchema } from "./common";

export const articleSchema = z.object({
  categoryId: stringSchema.uuid("카테고리를 선택해 주세요.").optional(),
  slug: slugSchema,
  title: stringSchema,
  draftTitle: stringSchema,
  description: stringSchema,
  jsonContent: z.string(),
  draftJsonContent: z.string(),
  htmlContent: z.string(),
  status: z.nativeEnum(ArticleStatus),
});

export const createArticleSchema = articleSchema;

export const updateArticleSchema = articleSchema
  .extend({
    image: z.string().nullish(),
  })
  .partial();
