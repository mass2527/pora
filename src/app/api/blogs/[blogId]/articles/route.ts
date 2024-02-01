import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ZodError } from "zod";

import { user } from "~/lib/auth";
import prisma from "~/lib/prisma";
import { createArticleSchema } from "~/lib/validations/article";

export async function POST(
  req: Request,
  { params }: { params: { blogId: string } }
) {
  try {
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const { categoryId, slug, title, description, content, status } =
      createArticleSchema.parse(json);
    const newArticle = await prisma.article.create({
      data: {
        categoryId,
        slug,
        title,
        description,
        content,
        blogId: params.blogId,
        status,
      },
    });

    return new Response(JSON.stringify(newArticle));
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