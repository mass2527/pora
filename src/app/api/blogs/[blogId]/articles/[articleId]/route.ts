import { getCurrentUser } from "~/lib/auth";
import prisma from "~/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: { blogId: string; articleId: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const deletedArticle = await prisma.article.delete({
      where: {
        id: params.articleId,
      },
    });
    return new Response(JSON.stringify(deletedArticle));
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}
