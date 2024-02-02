import { notFound } from "next/navigation";
import prisma from "~/lib/prisma";
import BlogPageTemplate from "../../blog-page-template";

export default async function BlogInCategoryPage({
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

  return <BlogPageTemplate blog={blog} title={category.name} />;
}
