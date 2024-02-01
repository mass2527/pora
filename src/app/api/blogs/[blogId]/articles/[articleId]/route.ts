import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ZodError } from "zod";
import { getCurrentUser, user } from "~/lib/auth";
import prisma from "~/lib/prisma";
import { updateArticleSchema } from "~/lib/validations/article";

export async function PATCH(
  req: Request,
  { params }: { params: { blogId: string; articleId: string } }
) {
  try {
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const {
      categoryId,
      slug,
      title,
      description,
      jsonContent,
      htmlContent,
      status,
    } = updateArticleSchema.partial().parse(json);
    const updatedArticle = await prisma.article.update({
      where: {
        id: params.articleId,
      },
      data: {
        categoryId,
        slug,
        title,
        description,
        jsonContent,
        htmlContent,
        status,
      },
    });
    return new Response(JSON.stringify(updatedArticle));
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return new Response(JSON.stringify(error.meta), { status: 409 });
      }
    }

    return new Response(null, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { blogId: string; articleId: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const deletedArticle = await prisma.article.delete({
      where: {
        id: params.articleId,
      },
    });
    return new Response(JSON.stringify(deletedArticle));
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}
