import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ZodError } from "zod";

import { getUser } from "~/lib/auth";
import prisma from "~/lib/prisma";
import { createBlogSchema } from "~/lib/validations/blog";

export async function POST(req: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const { name, slug } = createBlogSchema.parse(json);
    const newBlog = await prisma.blog.create({
      data: {
        name,
        slug,
        userId: user.id,
      },
    });

    return new Response(JSON.stringify(newBlog));
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
