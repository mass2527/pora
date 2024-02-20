import { ZodError } from "zod";
import { getUser } from "~/lib/auth";
import prisma from "~/lib/prisma";
import { updateCategoriesSchema } from "~/lib/validations/category";

export async function PATCH(
  request: Request,
  { params }: { params: { blogId: string } }
) {
  try {
    const user = await getUser();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const blog = await prisma.blog.findUnique({
      where: {
        id: params.blogId,
      },
      include: {
        categories: true,
      },
    });
    if (!blog) {
      return new Response("Not found", { status: 404 });
    }

    const body = await request.json();
    const categories = updateCategoriesSchema.parse(body);
    const updatedCategories = await prisma.$transaction(
      categories.map((category) => {
        return prisma.category.update({
          where: {
            id: category.id,
          },
          data: {
            orderIndex: category.orderIndex,
          },
        });
      })
    );

    return new Response(JSON.stringify(updatedCategories));
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}
