import { z } from "zod";

export const SLUG_STRING_REGEX_MESSAGE =
  "소문자 알파벳, 숫자로 시작 및 종료하고, 하이픈(-)으로 구분된 문자열을 입력해 주세요.";

const STRING_MAX_LENGTH = 191;

export const slugString = z
  .string()
  .min(1, getMinLengthMessage(1))
  .max(STRING_MAX_LENGTH, getMaxLengthMessage(STRING_MAX_LENGTH))
  .regex(/^[a-z0-9]+(?:(?:-)+[a-z0-9]+)*$/, SLUG_STRING_REGEX_MESSAGE);

// String(Prisma) === VARCHAR(191)(MySQL)
export const mysqlString = z.string().max(STRING_MAX_LENGTH);

export function getMinLengthMessage(minLength: number) {
  return `최소 ${minLength}글자 이상 입력해 주세요.`;
}

export function getMaxLengthMessage(maxLength: number) {
  return `최대 ${maxLength}글자 이하 입력해 주세요.`;
}
