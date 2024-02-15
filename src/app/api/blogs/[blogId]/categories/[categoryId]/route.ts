import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ZodError } from "zod";
import { getUser } from "~/lib/auth";
import { PRISMA_CLIENT_KNOWN_REQUEST_ERROR_CODES } from "~/lib/constants";
import prisma from "~/lib/prisma";
import { categorySchema } from "~/lib/validations/category";

export async function PATCH(
  req: Request,
  { params }: { params: { blogId: string; categoryId: string } }
) {
  try {
    const user = await getUser();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const { name, slug } = categorySchema.parse(json);
    const updatedCategory = await prisma.category.update({
      where: {
        id: params.categoryId,
      },
      data: {
        name,
        slug,
      },
    });
    return new Response(JSON.stringify(updatedCategory));
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    if (error instanceof PrismaClientKnownRequestError) {
      if (
        error.code ===
        PRISMA_CLIENT_KNOWN_REQUEST_ERROR_CODES.UNIQUE_CONSTRAINT_FAILED
      ) {
        return new Response(JSON.stringify(error.meta), { status: 409 });
      }
    }

    return new Response(null, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { blogId: string; categoryId: string } }
) {
  try {
    const user = await getUser();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const articles = await prisma.article.findMany({
      where: {
        categoryId: params.categoryId,
      },
    });
    if (articles.length > 0) {
      return new Response("Conflict", { status: 409 });
    }

    const categoryToDelete = await prisma.category.findUnique({
      where: {
        id: params.categoryId,
      },
    });
    if (!categoryToDelete) {
      return new Response("Not found", { status: 404 });
    }

    const deletedCategory = await prisma.$transaction(async (tx) => {
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

      const deletedCategory = await tx.category.delete({
        where: {
          id: params.categoryId,
        },
      });

      return deletedCategory;
    });

    return new Response(JSON.stringify(deletedCategory));
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}
