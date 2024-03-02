export const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg"];
export const MAX_IMAGE_SIZE_IN_MEGA_BYTES = 4.5;
export const PRISMA_ERROR_CODES = {
  UNIQUE_CONSTRAINT_FAILED: "P2002",
  DEPENDENT_RECORDS_NOT_FOUND: "P2025",
} as const satisfies Record<string, `P${number}${number}${number}${number}`>;
export const className =
  "prose prose-zinc prose-a:text-blue-500 prose-a:no-underline hover:prose-a:text-blue-500 hover:prose-a:underline";
