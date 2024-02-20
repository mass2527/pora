"use server";

import { Article, Blog } from "@prisma/client";
import { ServerActionResponse } from "./categories/actions";
import { getUser } from "~/lib/auth";
import prisma from "~/lib/prisma";
import { revalidatePath } from "next/cache";

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
  blogId: string
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
