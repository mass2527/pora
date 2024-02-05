import { getUser } from "~/lib/auth";
import prisma from "~/lib/prisma";

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
