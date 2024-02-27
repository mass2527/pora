"use server";

import { Blog } from "@prisma/client";
import { ZodError, z } from "zod";
import { getUser } from "~/lib/auth";
import { updateBlogSchema } from "~/lib/validations/blog";
import { ServerActionResponse } from "~/types";
import prisma from "~/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { PRISMA_ERROR_CODES } from "~/lib/constants";
import { revalidatePath } from "next/cache";

export async function updateBlog(
  blogId: string,
  values: z.infer<typeof updateBlogSchema>,
  path: string
): Promise<ServerActionResponse<Blog>> {
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

    const blog = await prisma.blog.update({
      where: {
        id: blogId,
      },
      data: updateBlogSchema.parse(values),
    });
    revalidatePath(path);

    return { status: "success", data: blog };
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

    if (error instanceof PrismaClientKnownRequestError) {
      // slug conflicts
      if (error.code === PRISMA_ERROR_CODES.UNIQUE_CONSTRAINT_FAILED) {
        return {
          status: "failure",
          error: {
            message: "Unique constraint failed",
            status: 409,
            data: error.meta,
          },
        };
      }
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
