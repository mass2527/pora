"use server";

import { Blog } from "@prisma/client";
import { ServerActionResponse } from "~/types";
import { createBlogSchema } from "~/lib/validations/blog";
import { z } from "zod";
import prisma from "~/lib/prisma";
import { getUser } from "~/lib/auth";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { PRISMA_ERROR_CODES } from "~/lib/constants";

export async function createBlog(
  values: z.infer<typeof createBlogSchema>
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

    const blog = await prisma.blog.create({
      data: {
        userId: user.id,
        ...values,
      },
    });

    return { status: "success", data: blog };
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === PRISMA_ERROR_CODES.UNIQUE_CONSTRAINT_FAILED) {
        return {
          status: "failure",
          error: {
            data: error.meta,
            status: 409,
            message: "Unique constraint failed",
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
