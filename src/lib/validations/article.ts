import { z } from "zod";
import { ARTICLE_STATUS } from "../constants";
import { slugString } from "./common";

export const updateArticleSchema = z.object({
  categoryId: z.string(),
  slug: slugString,
  title: z.string().min(1),
  description: z.string(),
  jsonContent: z.string(),
  htmlContent: z.string(),
  status: z.enum(Object.values(ARTICLE_STATUS) as [string, ...string[]]),
});

export const createArticleSchema = z.object({
  categoryId: z.string().optional(),
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  jsonContent: z.string(),
  htmlContent: z.string(),
  status: z.enum(Object.values(ARTICLE_STATUS) as [string, ...string[]]),
});
