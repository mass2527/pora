import { z } from "zod";
import { slugStringSchema } from "./common";

export const categorySchema = z.object({
  name: z.string().min(1, "최소 1글자 이상 입력해 주세요."),
  slug: slugStringSchema,
});
