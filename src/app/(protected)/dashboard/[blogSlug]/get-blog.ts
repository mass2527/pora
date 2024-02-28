import { notFound } from "next/navigation";
import { cache } from "react";
import { getAuthenticatedUserId } from "~/lib/auth";
import prisma from "~/lib/prisma";

export const getBlog = cache(async (blogSlug: string) => {
  const userId = await getAuthenticatedUserId();
  const blog = await prisma.blog.findUnique({
    where: {
      slug: blogSlug,
      userId,
    },
    include: {
      articles: {
        include: {
          blog: true,
          category: true,
        },
      },
    },
  });
  if (!blog) {
    notFound();
  }

  return blog;
});
