import { notFound } from "next/navigation";
import prisma from "~/lib/prisma";
import BlogTemplate from "../../blog-template";

export default async function BlogPage({
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
        orderBy: {
          createdAt: "desc",
        },
      },
      user: true,
      categories: {
        orderBy: {
          orderIndex: "asc",
        },
      },
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

  return <BlogTemplate params={params} title={category.name} blog={blog} />;
}
