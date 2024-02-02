import { Prisma } from "@prisma/client";
import React from "react";
import CategoryLinks from "./category/[categorySlug]/category-links";
import Link from "next/link";
import { formatDate } from "~/lib/utils";

export default function BlogPageTemplate({
  title,
  blog,
}: {
  title: string;
  blog: Prisma.BlogGetPayload<{
    include: {
      articles: true;
      categories: true;
    };
  }>;
}) {
  return (
    <div className="min-h-screen p-4">
      <CategoryLinks categories={blog.categories} />

      <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight my-10">
        {title}
      </h1>

      {blog.articles.length > 0 ? (
        <ul className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {blog.articles.map((article) => {
            return (
              <li key={article.id}>
                <Link href={`/${blog.slug}/${article.slug}`}>
                  <div className="border rounded-md p-4 flex flex-col gap-2">
                    <h2 className="text-xl lg:text-2xl font-semibold tracking-tight">
                      {article.title}
                    </h2>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-zinc-500">Author</span>
                      <span className="text-sm text-zinc-500">
                        {formatDate(article.createdAt)}
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
