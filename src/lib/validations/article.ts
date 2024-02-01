import { z } from "zod";
import { ARTICLE_STATUS } from "../constants";

export const createArticleSchema = z.object({
  categoryId: z.string().optional(),
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  jsonContent: z.string(),
  htmlContent: z.string(),
  status: z.enum(Object.values(ARTICLE_STATUS) as [string, ...string[]]),
});
