import { User } from "@prisma/client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import { Badge } from "~/components/ui/badge";
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
        include: {
          category: true,
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
    <main className="min-h-screen max-w-none">
      <div className="p-6 pt-3">
        <div className="max-w-[1200px] mx-auto">
          <Link
            href={`/${params.blogSlug}/category/${article.category?.slug}`}
            className="flex items-center text-sm text-zinc-500"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> 블로그로 돌아가기
          </Link>
          <div className="mt-6">
            <div className="flex items-center gap-2">
              <Badge>{article.category?.name}</Badge>
              <time
                className="text-sm text-zinc-500"
                dateTime={article.createdAt.toISOString()}
              >
                {formatDate(article.createdAt)}
              </time>
            </div>
            <div className="max-w-[860px]">
              <h1 className="text-3xl lg:text-5xl font-bold tracking-tighter mt-6">
                {article.title}
              </h1>
              {article.description && (
                <p className="text-zinc-500 lg:text-2xl mt-4 lg:mt-6">
                  {article.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden border-b p-6">
        <WrittenBy user={blog.user} />
      </div>

      <div
        className="lg:grid lg:px-6 lg:max-w-[1248px] xl:mx-auto"
        style={{
          gridTemplateColumns: "minmax(0,1fr) 340px",
        }}
      >
        <div className="p-6 lg:p-0">
          <div
            className="prose prose-zinc lg:pr-20 lg:pb-20 lg:border-r"
            dangerouslySetInnerHTML={{
              __html: article.htmlContent,
            }}
          />
        </div>
        <div className="hidden lg:block">
          <div className="flex flex-col gap-16 p-10 pt-0">
            <WrittenBy user={blog.user} />
          </div>
        </div>
      </div>
    </main>
  );
}

function WrittenBy({ user }: { user: User }) {
  return (
    <div className="flex flex-col gap-4">
      <span className="text-sm text-zinc-500">작성자</span>
      <span className="text-sm text-foreground">{user.name}</span>
    </div>
  );
}
