import { cache } from "react";
import prisma from "~/lib/prisma";
import { renderNotFoundIfNullable } from "~/lib/promise";

const getBlogOrNull = cache(async (userId: string, blogSlug: string) => {
  const blog = await prisma.blog.findUnique({
    where: {
      slug: blogSlug,
      userId,
    },
    include: {
      categories: { orderBy: { orderIndex: "asc" } },
    },
  });
  return blog;
});

export function getBlog(userId: string, blogSlug: string) {
  return renderNotFoundIfNullable(getBlogOrNull(userId, blogSlug));
}
