"use server";

import { User } from "@prisma/client";
import { ServerActionResponse } from "~/types";
import { getUser } from "~/lib/auth";
import { updateUserSchema } from "~/lib/validations/user";
import { ZodError, z } from "zod";
import prisma from "~/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateUser(
  values: z.infer<typeof updateUserSchema>,
  path: string
): Promise<ServerActionResponse<User>> {
  try {
    const user = await getUser();
    if (!user) {
      return {
        status: "failure",
        error: {
          message: "Unauthorized",
          status: 401,
        },
      };
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: updateUserSchema.parse(values),
    });
    revalidatePath(path);

    return {
      status: "success",
      data: updatedUser,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        status: "failure",
        error: {
          message: "Invalid data",
          status: 422,
          data: error.issues,
        },
      };
    }

    return {
      status: "failure",
      error: {
        message: "Unknown",
        status: 500,
      },
    };
  }
}
