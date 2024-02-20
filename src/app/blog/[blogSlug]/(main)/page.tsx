import { notFound } from "next/navigation";
import React from "react";
import prisma from "~/lib/prisma";
import BlogTemplate from "./blog-template";

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
      user: true,
      articles: {
        orderBy: {
          createdAt: "desc",
        },
        where: {
          status: {
            equals: "PUBLISHED",
          },
        },
      },
    },
  });
  if (!blog) {
    notFound();
  }

  return <BlogTemplate params={params} title="모든 아티클" blog={blog} />;
}
