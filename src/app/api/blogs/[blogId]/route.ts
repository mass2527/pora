import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ZodError } from "zod";
import { getUser } from "~/lib/auth";
import { PRISMA_ERROR_CODES } from "~/lib/constants";
import prisma from "~/lib/prisma";
import { updateBlogSchema } from "~/lib/validations/blog";

export async function PATCH(
  req: Request,
  { params }: { params: { blogId: string } }
) {
  try {
    const user = await getUser();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const { name, description, image } = updateBlogSchema.parse(json);
    const updatedBlog = await prisma.blog.update({
      where: {
        id: params.blogId,
      },
      data: {
        name,
        description,
        image,
      },
    });
    return new Response(JSON.stringify(updatedBlog));
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
  req: Request,
  { params }: { params: { blogId: string } }
) {
  try {
    const user = await getUser();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const deletedBlog = await prisma.blog.delete({
      where: {
        id: params.blogId,
      },
    });
    return new Response(JSON.stringify(deletedBlog));
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}
