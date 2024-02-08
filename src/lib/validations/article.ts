import { ArticleStatus } from "@prisma/client";
import { z } from "zod";

export const createArticleSchema = z.object({
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
