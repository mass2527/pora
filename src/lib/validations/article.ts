import { z } from "zod";
import { ARTICLE_STATUS } from "../constants";

export const articleSchema = z.object({
  categoryId: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  content: z.string().min(1),
  status: z.enum(Object.values(ARTICLE_STATUS) as [string, ...string[]]),
});

export const createArticleSchema = z.object({
  categoryId: z.string().optional(),
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  content: z.string(),
  status: z.enum(Object.values(ARTICLE_STATUS) as [string, ...string[]]),
});
