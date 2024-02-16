import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ZodError } from "zod";
import { getUser } from "~/lib/auth";
import { PRISMA_ERROR_CODES } from "~/lib/constants";
import prisma from "~/lib/prisma";
import {
  createCategorySchema,
  updateCategoriesSchema,
} from "~/lib/validations/category";

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
    const { name, slug } = createCategorySchema.parse(body);
    const categoryCount = await prisma.category.count({
      where: {
        blogId: params.blogId,
      },
    });
    const category = await prisma.category.create({
      data: {
        name,
        slug,
        blogId: params.blogId,
        orderIndex: categoryCount,
      },
    });

    return new Response(JSON.stringify(category));
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
