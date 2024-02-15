import { ArticleStatus } from "@prisma/client";
import { z } from "zod";
import { slugSchema } from "./common";

export const createBlogArticleSchema = z.object({
  categoryId: z.string().optional(),
  slug: z.string(),
  title: z.string(),
  draftTitle: z.string(),
  description: z.string(),
  jsonContent: z.string(),
  draftJsonContent: z.string(),
  htmlContent: z.string(),
  status: z.nativeEnum(ArticleStatus),
});

export const updateBlogArticleSchema = z
  .object({
    categoryId: z.string().optional(),
    slug: slugSchema,
    title: z.string(),
    draftTitle: z.string(),
    description: z.string().optional(),
    jsonContent: z.string(),
    draftJsonContent: z.string(),
    htmlContent: z.string(),
    status: z.nativeEnum(ArticleStatus),
    image: z.string().nullish(),
  })
  .partial();
