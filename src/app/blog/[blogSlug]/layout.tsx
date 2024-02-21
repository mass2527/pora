import { Metadata } from "next";
import Link from "next/link";
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
    title: {
      default: blog.name,
      template: `%s | ${blog.name}`,
    },
    description: blog.description,
    openGraph: {
      title: blog.name,
      description: blog.description ?? undefined,
      images: blog.image ?? undefined,
    },
  };
}

export default async function BlogLayout({
  params,
  children,
}: {
  params: { blogSlug: string };
  children: ReactNode;
}) {
  const blog = await prisma.blog.findUnique({
    where: {
      slug: params.blogSlug,
    },
  });
  if (!blog) {
    notFound();
  }

  return (
    <div>
      <div className="p-4 border-b sticky top-0 bg-background z-10">
        <Link
          href={`/blog/${params.blogSlug}`}
          className="text-xl font-semibold tracking-tight"
        >
          {blog.name}
        </Link>
      </div>
      {children}
    </div>
  );
}
