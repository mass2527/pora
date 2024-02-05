import { notFound } from "next/navigation";
import React from "react";
import { getUser } from "~/lib/auth";
import prisma from "~/lib/prisma";
import DeleteBlogButton from "./delete-blog-button";

export default async function BlogSettingsPage({
  params,
}: {
  params: { blogSlug: string };
}) {
  const user = await getUser();
  if (!user) {
    notFound();
  }

  const blog = await prisma.blog.findUnique({
    where: {
      slug: params.blogSlug,
      userId: user.id,
    },
    include: {
      categories: true,
    },
  });
  if (!blog) {
    notFound();
  }

  return (
    <div className="p-4 min-h-screen">
      <h1 className="text-2xl font-semibold tracking-tight">설정</h1>

      <DeleteBlogButton blogId={blog.id} />
    </div>
  );
}
