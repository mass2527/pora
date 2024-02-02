import { notFound } from "next/navigation";
import React from "react";
import prisma from "~/lib/prisma";
import BlogPageTemplate from "./blog-page-template";

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
      categories: true,
      articles: true,
    },
  });
  if (!blog) {
    notFound();
  }

  return <BlogPageTemplate blog={blog} title="모든 아티클" />;
}
