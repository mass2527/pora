import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ZodError, z } from "zod";
import { user } from "~/lib/auth";
import prisma from "~/lib/prisma";
import { createCategorySchema } from "~/lib/validations/category";

export async function POST(
  req: Request,
  { params }: { params: { blogId: string } }
) {
  try {
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const { name, slug } = createCategorySchema.parse(json);
    const newCategory = await prisma.category.create({
      data: {
        name,
        slug,
        blogId: params.blogId,
      },
    });

    return new Response(JSON.stringify(newCategory));
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
