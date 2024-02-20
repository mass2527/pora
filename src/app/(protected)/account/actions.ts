"use server";

import { User } from "@prisma/client";
import { ServerActionResponse } from "../dashboard/[blogSlug]/categories/actions";
import { getUser } from "~/lib/auth";
import { updateUserSchema } from "~/lib/validations/user";
import { z } from "zod";
import prisma from "~/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateUser(
  userId: string,
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
        id: userId,
      },
      data: values,
    });

    revalidatePath(path);

    return {
      status: "success",
      data: updatedUser,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "failure",
      error: {
        message: "Unknown",
        status: 500,
      },
    };
  }
}
