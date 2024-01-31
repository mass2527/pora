import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "최소 1글자 이상 입력해 주세요."),
  slug: z
    .string()
    .min(1, "최소 1글자 이상 입력해 주세요.")
    .regex(
      /^[a-z0-9]+(?:(?:-|_)+[a-z0-9]+)*$/,
      "소문자 알파벳, 숫자로 시작 및 종료하고, 하이픈(-) 또는 언더스코어(_)로 구분된 문자열이어야 합니다. 특수문자는 허용되지 않습니다."
    ),
});
