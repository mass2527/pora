import { z } from "zod";
import { stringSchema } from "./common";

export const updateUserSchema = z.object({
  name: stringSchema.optional(),
  image: z.string().optional(),
  jobPosition: stringSchema.optional(),
});
