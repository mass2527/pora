import { getUser } from "~/lib/auth";
import prisma from "~/lib/prisma";

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
