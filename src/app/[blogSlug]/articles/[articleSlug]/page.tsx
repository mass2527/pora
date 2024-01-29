import { notFound } from "next/navigation";
import React from "react";
import prisma from "~/lib/prisma";

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
    },
  });
  if (!blog) {
    notFound();
  }

  const article = blog.articles[0];
  if (!article) {
    notFound();
  }

  return (
    <div className="flex flex-col border min-h-screen p-4">
      <article className="prose prose-slate mx-auto">
        <h1>{article.title}</h1>
        {article.content}
      </article>
    </div>
  );
}
