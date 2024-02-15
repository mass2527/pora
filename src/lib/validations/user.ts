import { z } from "zod";
import { getMaxLengthMessage, getMinLengthMessage } from "./common";

export const updateUserSchema = z
  .object({
    name: z
      .string()
      .min(1, getMinLengthMessage(1))
      .max(32, getMaxLengthMessage(32)),
    image: z.string(),
    jobPosition: z
      .string()
      .min(1, getMinLengthMessage(1))
      .max(32, getMaxLengthMessage(32)),
  })
  .partial();
