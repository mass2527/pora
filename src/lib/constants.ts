export const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg"];
export const MAX_IMAGE_SIZE_IN_MEGA_BYTES = 4.5;
export const PRISMA_CLIENT_KNOWN_REQUEST_ERROR_CODES = {
  WHERE_CONDITION_DOES_NOT_EXIST: "P2001",
  UNIQUE_CONSTRAINT_FAILED: "P2002",
} as const satisfies Record<string, `P${number}${number}${number}${number}`>;
