import { z } from "zod";
import { mysqlString } from "./common";

export const updateUserSchema = z.object({
  name: mysqlString.optional(),
  image: z.string().optional(),
  jobPosition: mysqlString.optional(),
});
