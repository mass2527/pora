import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { getUser } from "~/lib/auth";
import { PRISMA_ERROR_CODES } from "~/lib/constants";
import prisma from "~/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: { blogId: string; articleId: string } }
) {
  try {
    const user = await getUser();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const article = await prisma.article.delete({
      where: {
        id: params.articleId,
        blog: {
          id: params.blogId,
        },
      },
    });
    return new Response(JSON.stringify(article));
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === PRISMA_ERROR_CODES.DEPENDENT_RECORDS_NOT_FOUND) {
        return new Response(JSON.stringify(error.meta), { status: 404 });
      }
    }

    return new Response(null, { status: 500 });
  }
}
