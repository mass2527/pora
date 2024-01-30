import { ZodError, z } from "zod";
import { user } from "~/lib/auth";
import prisma from "~/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { blogId: string } }
) {
  try {
    if (!user) {
      return new Response("Unauthorized", { status: 403 });
    }

    const json = await req.json();
    const { name, slug } = z
      .object({
        name: z.string().min(1),
        slug: z.string().min(1),
      })
      .parse(json);
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

    return new Response(null, { status: 500 });
  }
}
