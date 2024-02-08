import { ArticleStatus } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ZodError, z } from "zod";
import { getUser } from "~/lib/auth";
import prisma from "~/lib/prisma";
import { slugString } from "~/lib/validations/common";

const schema = z
  .object({
    categoryId: z.string().optional(),
    slug: slugString,
    title: z.string(),
    draftTitle: z.string(),
    description: z.string().optional(),
    jsonContent: z.string(),
    draftJsonContent: z.string(),
    htmlContent: z.string(),
    status: z.nativeEnum(ArticleStatus),
  })
  .partial();

export async function PATCH(
  req: Request,
  { params }: { params: { blogId: string; articleId: string } }
) {
  try {
    const user = await getUser();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const {
      categoryId,
      slug,
      title,
      draftTitle,
      description,
      jsonContent,
      draftJsonContent,
      htmlContent,
      status,
    } = schema.parse(json);
    const updatedArticle = await prisma.article.update({
      where: {
        id: params.articleId,
      },
      data: {
        categoryId,
        slug,
        title,
        draftTitle,
        description,
        jsonContent,
        draftJsonContent,
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
    const user = await getUser();
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
