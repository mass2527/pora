import { type ClassValue, clsx } from "clsx";
import { notFound } from "next/navigation";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function assert(
  condition: unknown,
  message?: string
): asserts condition {
  if (!condition) {
    throw new Error(message ?? "Assertion failed");
  }
}

export function formatDate(
  date: Date,
  {
    locales = "ko-KR",
    options,
  }: { locales?: string | string[]; options?: Intl.DateTimeFormatOptions } = {}
) {
  return new Intl.DateTimeFormat(locales, options).format(date);
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

export function getUrlFromString(str: string) {
  if (isValidUrl(str)) return str;
  try {
    if (str.includes(".") && !str.includes(" ")) {
      return new URL(`https://${str}`).toString();
    }
  } catch (e) {
    return null;
  }
}
export async function ifNullable<T>(
  promise: Promise<T>,
  onNullable: () => never
) {
  const data = await promise;
  if (!data) {
    onNullable();
  }

  return data;
}

export function renderNotFoundIfNullable<T>(promise: Promise<T>) {
  return ifNullable(promise, () => notFound());
}
