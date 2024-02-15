import { ArticleStatus } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ZodError, z } from "zod";
import { getUser } from "~/lib/auth";
import { PRISMA_ERROR_CODES } from "~/lib/constants";
import prisma from "~/lib/prisma";
import { slugStringSchema } from "~/lib/validations/common";

const schema = z
  .object({
    categoryId: z.string().optional(),
    slug: slugStringSchema,
    title: z.string(),
    draftTitle: z.string(),
    description: z.string().optional(),
    jsonContent: z.string(),
    draftJsonContent: z.string(),
    htmlContent: z.string(),
    status: z.nativeEnum(ArticleStatus),
    image: z.string().nullish(),
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
      image,
    } = schema.parse(json);
    const updatedArticle = await prisma.article.update({
      where: {
        id: params.articleId,
        blog: {
          id: params.blogId,
        },
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
        image,
      },
    });
    return new Response(JSON.stringify(updatedArticle));
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === PRISMA_ERROR_CODES.UNIQUE_CONSTRAINT_FAILED) {
        return new Response(JSON.stringify(error.meta), { status: 409 });
      } else if (
        error.code === PRISMA_ERROR_CODES.DEPENDENT_RECORDS_NOT_FOUND
      ) {
        return new Response(JSON.stringify(error.meta), { status: 404 });
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
        blog: {
          id: params.blogId,
        },
      },
    });
    return new Response(JSON.stringify(deletedArticle));
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === PRISMA_ERROR_CODES.DEPENDENT_RECORDS_NOT_FOUND) {
        return new Response(JSON.stringify(error.meta), { status: 404 });
      }
    }

    return new Response(null, { status: 500 });
  }
}
