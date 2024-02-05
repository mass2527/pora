import { z } from "zod";

export const updateBlogSchema = z.object({
  name: z.string().min(1, { message: "최소 1글자 이상 입력해 주세요." }),
});
