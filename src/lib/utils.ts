import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function invariant(
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
    locales,
    options,
  }: { locales?: string | string[]; options?: Intl.DateTimeFormatOptions } = {}
) {
  return new Intl.DateTimeFormat(locales, options).format(date);
}

export function assertNever(x: never): never {
  throw new Error("Unexpected object: " + x);
}
