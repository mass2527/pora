import { ZodError, z } from "zod";
import { user } from "~/lib/auth";
import prisma from "~/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { blogId: string; categoryId: string } }
) {
  try {
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const { name, slug } = z
      .object({
        name: z.string().min(1),
        slug: z.string().min(1),
      })
      .parse(json);
    const updatedCategory = await prisma.category.update({
      where: {
        id: params.categoryId,
      },
      data: {
        name,
        slug,
      },
    });
    return new Response(JSON.stringify(updatedCategory));
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { blogId: string; categoryId: string } }
) {
  try {
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const deletedCategory = await prisma.category.delete({
      where: {
        id: params.categoryId,
      },
    });
    return new Response(JSON.stringify(deletedCategory));
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}
