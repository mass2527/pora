"use server";

import { Article, Blog } from "@prisma/client";
import { ServerActionResponse } from "~/types";
import { getUser } from "~/lib/auth";
import prisma from "~/lib/prisma";
import { revalidatePath } from "next/cache";
import { createArticleSchema } from "~/lib/validations/article";
import { z } from "zod";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { PRISMA_ERROR_CODES } from "~/lib/constants";

export async function deleteArticle(
  articleId: string,
  path: string
): Promise<ServerActionResponse<Article>> {
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

    const article = await prisma.article.delete({
      where: {
        id: articleId,
      },
    });
    revalidatePath(path);

    return {
      status: "success",
      data: article,
    };
  } catch (error) {
    return {
      status: "failure",
      error: {
        message: "Unknown",
        status: 500,
      },
    };
  }
}

export async function deleteBlog(
  blogId: string,
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

    const blog = await prisma.blog.delete({
      where: {
        id: blogId,
      },
    });
    revalidatePath(path);

    return {
      status: "success",
      data: blog,
    };
  } catch (error) {
    return {
      status: "failure",
      error: {
        message: "Unknown",
        status: 500,
      },
    };
  }
}

export async function createArticle(
  blogId: string,
  values: z.infer<typeof createArticleSchema>,
  path: string
): Promise<ServerActionResponse<Article>> {
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

    const article = await prisma.article.create({
      data: {
        ...values,
        blogId,
      },
    });
    revalidatePath(path);

    return {
      status: "success",
      data: article,
    };
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
