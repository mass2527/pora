"use server";

import { z } from "zod";
import { getUser } from "~/lib/auth";
import prisma from "~/lib/prisma";
import { updateArticleSchema } from "~/lib/validations/article";
import { ServerActionResponse } from "../../categories/actions";
import { Article } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { PRISMA_ERROR_CODES } from "~/lib/constants";

export async function updateArticle(
  articleId: string,
  values: z.infer<typeof updateArticleSchema>
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

    const article = await prisma.article.update({
      where: {
        id: articleId,
      },
      data: values,
    });
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
