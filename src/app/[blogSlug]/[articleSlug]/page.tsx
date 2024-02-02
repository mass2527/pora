import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import prisma from "~/lib/prisma";
import { formatDate } from "~/lib/utils";
import { getArticleStatusLabel } from "~/services/article";

export default async function ArticleDetailsPage({
  params,
}: {
  params: { blogSlug: string; articleSlug: string };
}) {
  const blog = await prisma.blog.findUnique({
    where: {
      slug: params.blogSlug,
    },
    include: {
      articles: {
        where: {
          slug: params.articleSlug,
        },
      },
      user: true,
    },
  });
  if (!blog) {
    notFound();
  }

  const article = blog.articles[0];
  if (!article || getArticleStatusLabel(article.status) !== "발행됨") {
    notFound();
  }

  return (
    <main className="min-h-screen prose prose-zinc max-w-none">
      <div className="p-6 pt-3">
        <div className="max-w-[1200px] mx-auto">
          <Link href={`/${params.blogSlug}`}>다른 아티클 보기</Link>
          <div className="mb-8">
            <time
              className="text-sm text-zinc-500"
              dateTime={article.createdAt.toISOString()}
            >
              {formatDate(article.createdAt)}
            </time>
          </div>
          <div className="max-w-[860px]">
            <h1 className="text-3xl lg:text-5xl">{article.title}</h1>
            {article.description && (
              <p className="text-zinc-500 lg:text-2xl">{article.description}</p>
            )}
          </div>
        </div>
      </div>

      <div className="lg:hidden border-b p-6">
        <PostedBy user={blog.user} />
      </div>

      <div
        className="lg:grid lg:px-6 lg:max-w-[1248px] xl:mx-auto"
        style={{
          gridTemplateColumns: "minmax(0,1fr) 340px",
        }}
      >
        <div className="p-6 lg:p-0">
          <div
            className="lg:pr-20 lg:pb-20 lg:border-r"
            dangerouslySetInnerHTML={{
              __html: article.htmlContent,
            }}
          />
        </div>
        <div className="hidden lg:block">
          <div className="flex flex-col gap-16 p-10 pt-0">
            <PostedBy user={blog.user} />
          </div>
        </div>
      </div>
    </main>
  );
}

function PostedBy({ user }: { user: { username: string } }) {
  return (
    <div className="flex flex-col gap-4">
      <span className="text-sm text-zinc-500">작성자</span>
      <span className="text-sm text-foreground">{user.username}</span>
    </div>
  );
}
