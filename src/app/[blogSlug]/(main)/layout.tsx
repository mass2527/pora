import { Blog } from "@prisma/client";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import React, { ReactNode } from "react";
import prisma from "~/lib/prisma";

export async function generateMetadata({
  params,
}: {
  params: { blogSlug: string };
}): Promise<Metadata> {
  const blog = await prisma.blog.findUnique({
    where: {
      slug: params.blogSlug,
    },
  });
  if (!blog) {
    notFound();
  }

  return {
    title: blog.name,
    description: blog.description,
    openGraph: {
      title: blog.name,
      description: blog.description ?? "",
      images: blog.image ? [blog.image] : [],
    },
  };
}

export default function BlogMainLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
