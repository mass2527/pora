import { cache } from "react";
import prisma from "~/lib/prisma";
import { renderNotFoundIfNullable } from "~/lib/utils";

const getBlog = cache(async (userId: string, blogSlug: string) => {
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

export function getBlogOrRenderNotFoundPage(userId: string, blogSlug: string) {
  return renderNotFoundIfNullable(getBlog(userId, blogSlug));
}
