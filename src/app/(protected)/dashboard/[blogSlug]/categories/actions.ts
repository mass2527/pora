"use server";

import { Category } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getUser } from "~/lib/auth";
import { PRISMA_ERROR_CODES } from "~/lib/constants";
import prisma from "~/lib/prisma";
import { createCategorySchema } from "~/lib/validations/category";

export type ServerActionResponse<T = unknown> =
  | {
      status: "success";
      data: T;
    }
  | {
      status: "failure";
      error: {
        message: string;
        status: number;
        data?: unknown;
      };
    };

export async function createBlogCategory(
  blogId: string,
  values: z.infer<typeof createCategorySchema>,
  path: string
): Promise<ServerActionResponse<Category>> {
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

    const categoryCount = await prisma.category.count({
      where: {
        blogId,
      },
    });
    const category = await prisma.category.create({
      data: {
        ...values,
        blogId,
        orderIndex: categoryCount,
      },
    });

    revalidatePath(path);

    return {
      status: "success",
      data: category,
    };
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === PRISMA_ERROR_CODES.UNIQUE_CONSTRAINT_FAILED) {
        return {
          status: "failure",
          error: {
            message: "Unique Constraint failed",
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

export async function deleteCategory(
  categoryId: string,
  path: string
): Promise<ServerActionResponse<Category>> {
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

    const articleCount = await prisma.article.count({
      where: {
        categoryId: categoryId,
      },
    });
    if (articleCount > 0) {
      return {
        status: "failure",
        error: {
          message: "Conflict",
          status: 409,
        },
      };
    }

    const categoryToDelete = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });
    if (!categoryToDelete) {
      return {
        status: "failure",
        error: {
          message: "Not found",
          status: 404,
        },
      };
    }

    const category = await prisma.$transaction(async (tx) => {
      await tx.category.updateMany({
        where: {
          orderIndex: {
            gt: categoryToDelete.orderIndex,
          },
        },
        data: {
          orderIndex: {
            decrement: 1,
          },
        },
      });

      const category = await tx.category.delete({
        where: {
          id: categoryId,
        },
      });

      return category;
    });

    revalidatePath(path);

    return {
      status: "success",
      data: category,
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
