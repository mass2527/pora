import { buttonVariants } from "~/components/ui/button";
import Link from "next/link";
import prisma from "~/lib/prisma";
import { notFound } from "next/navigation";
import EditArticleForm from "./edit-article-form";
import { getCurrentUser } from "~/lib/auth";

export default async function ArticleEditPage({
  params,
}: {
  params: { blogSlug: string; articleSlug: string };
}) {
  const user = await getCurrentUser();
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
      <div>
        <Link
          className={buttonVariants({ variant: "outline" })}
          href={`/dashboard/${params.blogSlug}`}
        >
          취소
        </Link>
      </div>

      <div className="min-h-[calc(100vh-72px)] grid place-items-center">
        <EditArticleForm article={article} />
      </div>
    </div>
  );
}
