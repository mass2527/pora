import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ZodError } from "zod";
import { getUser } from "~/lib/auth";
import { PRISMA_ERROR_CODES } from "~/lib/constants";
import prisma from "~/lib/prisma";
import { updateBlogSchema } from "~/lib/validations/blog";

export async function PATCH(
  request: Request,
  { params }: { params: { blogId: string } }
) {
  try {
    const user = await getUser();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { name, description, slug, image } = updateBlogSchema.parse(body);
    const blog = await prisma.blog.update({
      where: {
        id: params.blogId,
      },
      data: {
        name,
        description,
        slug,
        image,
      },
    });
    return new Response(JSON.stringify(blog));
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

export async function DELETE(
  request: Request,
  { params }: { params: { blogId: string } }
) {
  try {
    const user = await getUser();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const blog = await prisma.blog.delete({
      where: {
        id: params.blogId,
      },
    });
    return new Response(JSON.stringify(blog));
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}
