import { z } from "zod";
import { updateUserSchema } from "~/lib/validations/user";
import { ResponseError } from "~/lib/errors";
import { tsFetch } from "~/lib/ts-fetch";
import { User } from "@prisma/client";

export async function updateUser(
  userId: string,
  values: z.infer<typeof updateUserSchema>
): Promise<User> {
  const response = await tsFetch(`/api/users/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });
  if (!response.ok) {
    throw new ResponseError("", response);
  }

  return response.json();
}
