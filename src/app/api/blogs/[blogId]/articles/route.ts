import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ZodError } from "zod";

import { getUser } from "~/lib/auth";
import { PRISMA_ERROR_CODES } from "~/lib/constants";
import prisma from "~/lib/prisma";
import { createArticleSchema } from "~/lib/validations/article";

export async function POST(
  request: Request,
  { params }: { params: { blogId: string } }
) {
  try {
    const user = await getUser();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await request.json();
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
    } = createArticleSchema.parse(body);
    const article = await prisma.article.create({
      data: {
        categoryId,
        slug,
        title,
        draftTitle,
        description,
        jsonContent,
        draftJsonContent,
        htmlContent,
        blogId: params.blogId,
        status,
      },
    });

    return new Response(JSON.stringify(article));
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === PRISMA_ERROR_CODES.UNIQUE_CONSTRAINT_FAILED) {
        return new Response(JSON.stringify(error.meta), { status: 409 });
      }
    }

    return new Response(null, { status: 500 });
  }
}
