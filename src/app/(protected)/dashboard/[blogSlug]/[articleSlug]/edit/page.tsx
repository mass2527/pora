import prisma from "~/lib/prisma";
import { notFound } from "next/navigation";
import EditBlogArticle from "./edit-blog-article";
import { getUser } from "~/lib/auth";
import { assertAuthenticated } from "~/lib/asserts";

export default async function EditBlogArticlePage({
  params,
}: {
  params: { blogSlug: string; articleSlug: string };
}) {
  const user = await getUser();
  assertAuthenticated(user);

  const article = await prisma.article.findFirst({
    where: {
      slug: params.articleSlug,
      blog: {
        slug: params.blogSlug,
        userId: user.id,
      },
    },
    include: {
      blog: {
        include: {
          categories: true,
        },
      },
    },
  });
  if (!article) {
    notFound();
  }

  return (
    <div className="p-4">
      <div className="max-w-[720px] mx-auto">
        <EditBlogArticle blogArticle={article} />
      </div>
    </div>
  );
}
