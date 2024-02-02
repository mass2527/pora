import { notFound } from "next/navigation";
import prisma from "~/lib/prisma";
import CategoryLinks from "./category-links";
import Link from "next/link";
import { formatDate } from "~/lib/utils";

export default async function ArticleListInCategoryPage({
  params,
}: {
  params: { blogSlug: string; categorySlug: string };
}) {
  const blog = await prisma.blog.findUnique({
    where: {
      slug: params.blogSlug,
    },
    include: {
      articles: {
        where: {
          category: {
            slug: params.categorySlug,
          },
        },
      },
      categories: true,
    },
  });
  if (!blog) {
    notFound();
  }

  const category = await prisma.category.findUnique({
    where: {
      blogId_slug: {
        blogId: blog.id,
        slug: params.categorySlug,
      },
    },
  });
  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen p-4">
      <CategoryLinks categories={blog.categories} />

      <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight my-10">
        {category.name}
      </h1>

      {blog.articles.length > 0 ? (
        <ul className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {blog.articles.map((article) => {
            return (
              <li key={article.id}>
                <Link href={`/${params.blogSlug}/${article.slug}`}>
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
