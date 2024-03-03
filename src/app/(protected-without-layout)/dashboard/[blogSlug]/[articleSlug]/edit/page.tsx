import prisma from "~/lib/prisma";
import { getAuthenticatedUserId } from "~/lib/auth";
import EditBlogArticle from "./edit-blog-article";
import Await from "~/components/await";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Skeleton } from "~/components/ui/skeleton";

export default async function EditBlogArticlePage({
  params,
}: {
  params: { blogSlug: string; articleSlug: string };
}) {
  const userId = await getAuthenticatedUserId();
  const articlePromise = prisma.article.findFirst({
    where: {
      slug: params.articleSlug,
      blog: {
        slug: params.blogSlug,
        userId,
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

  return (
    <div>
      <div className="mx-auto">
        <Suspense fallback={<Skeleton className="h-[652px]" />}>
          <Await promise={articlePromise}>
            {(article) => {
              if (!article) {
                notFound();
              }

              return <EditBlogArticle blogArticle={article} />;
            }}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}
