import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ZodError, z } from "zod";
import { getUser } from "~/lib/auth";
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
    const { name } = updateBlogSchema.parse(json);
    const updatedCategory = await prisma.blog.update({
      where: {
        id: params.blogId,
      },
      data: {
        name,
      },
    });
    return new Response(JSON.stringify(updatedCategory));
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
