import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReactNode } from "react";
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
      description: blog.description ?? undefined,
      images: blog.image ? [blog.image] : undefined,
    },
  };
}

export default function BlogMainLayout({ children }: { children: ReactNode }) {
  return children;
}
