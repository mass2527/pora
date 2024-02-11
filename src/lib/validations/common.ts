import { z } from "zod";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGE_SIZE_IN_MEGA_BYTES,
} from "../constants";

export const SLUG_STRING_REGEX_MESSAGE =
  "소문자 알파벳, 숫자로 시작 및 종료하고, 하이픈(-)으로 구분된 문자열을 입력해 주세요.";

const STRING_MAX_LENGTH = 191;

export const slugStringSchema = z
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

const sizeInMB = (sizeInBytes: number, fractionDigits = 2) => {
  const result = sizeInBytes / (1024 * 1024);
  return Number(result.toFixed(fractionDigits));
};

export const imageFileSchema = z
  .custom<File>()
  .refine((file) => {
    return sizeInMB(file.size) <= MAX_IMAGE_SIZE_IN_MEGA_BYTES;
  }, `최대 ${MAX_IMAGE_SIZE_IN_MEGA_BYTES}MB인 이미지를 업로드해 주세요.`)
  .refine((file) => {
    return ACCEPTED_IMAGE_TYPES.includes(file.type);
  }, `${ACCEPTED_IMAGE_TYPES.map((type) => type.split("/")[1]).join(" 또는 ")} 형식의 이미지 파일을 업로드해 주세요.`);
