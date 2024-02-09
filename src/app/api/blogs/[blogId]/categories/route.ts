import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ZodError, z } from "zod";
import { getUser } from "~/lib/auth";
import prisma from "~/lib/prisma";
import { categorySchema } from "~/lib/validations/category";

export async function POST(
  req: Request,
  { params }: { params: { blogId: string } }
) {
  try {
    const user = await getUser();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const { name, slug } = categorySchema.parse(json);
    const categoryCount = await prisma.category.count({
      where: {
        blogId: params.blogId,
      },
    });
    const newCategory = await prisma.category.create({
      data: {
        name,
        slug,
        blogId: params.blogId,
        orderIndex: categoryCount,
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

export async function PATCH(
  req: Request,
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

    const json = await req.json();
    const schema = z.array(
      z.object({
        id: z.string(),
        orderIndex: z.coerce.number(),
      })
    );
    const categories = schema.parse(json);
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
