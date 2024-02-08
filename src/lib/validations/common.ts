import { z } from "zod";

export const slugString = z
  .string()
  .min(1, "최소 1글자 이상 입력해 주세요.")
  .regex(
    /^[a-z0-9]+(?:(?:-)+[a-z0-9]+)*$/,
    "소문자 알파벳, 숫자로 시작 및 종료하고, 하이픈(-)으로 구분된 문자열이어야 합니다."
  );

// String(Prisma) === VARCHAR(191)(MySQL)
export const mysqlString = z.string().max(191);
