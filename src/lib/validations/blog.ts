import { z } from "zod";
import {
  getMaxLengthMessage,
  getMinLengthMessage,
  slugStringSchema,
} from "./common";

export const BLOG_NAME_MAX_LENGTH = 32;
const BLOG_NAME_MIN_LENGTH = 1;
export const BLOG_DESCRIPTION_MAX_LENGTH = 160;

export const createBlogCommonSchema = z.object({
  name: z
    .string()
    .min(BLOG_NAME_MIN_LENGTH, getMinLengthMessage(BLOG_NAME_MIN_LENGTH))
    .max(BLOG_NAME_MAX_LENGTH, getMaxLengthMessage(BLOG_NAME_MAX_LENGTH)),
  description: z
    .string()
    .max(
      BLOG_DESCRIPTION_MAX_LENGTH,
      getMaxLengthMessage(BLOG_DESCRIPTION_MAX_LENGTH)
    ),
  slug: slugStringSchema,
});

export const updateBlogSchema = z.object({
  name: z
    .string()
    .min(1, { message: "최소 1글자 이상 입력해 주세요." })
    .optional(),
  description: z.string().optional(),
});
