import prisma from "~/lib/prisma";
import { notFound } from "next/navigation";
import EditArticle from "./edit-article";
import { getUser } from "~/lib/auth";

export default async function ArticleEditPage({
  params,
}: {
  params: { blogSlug: string; articleSlug: string };
}) {
  const user = await getUser();
  if (!user) {
    notFound();
  }

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
        <EditArticle article={article} />
      </div>
    </div>
  );
}
