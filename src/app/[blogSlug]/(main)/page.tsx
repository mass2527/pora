import { notFound } from "next/navigation";
import React from "react";
import prisma from "~/lib/prisma";
import BlogPageTemplate from "../(main)/blog-page-template";


export default async function BlogPage({
  params,
}: {
  params: { blogSlug: string };
}) {
  const blog = await prisma.blog.findUnique({
    where: {
      slug: params.blogSlug,
    },
    include: {
      categories: {
        orderBy: {
          orderIndex: "asc",
        },
      },
      articles: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
  if (!blog) {
    notFound();
  }

  return <BlogPageTemplate blog={blog} title="모든 아티클" />;
}
