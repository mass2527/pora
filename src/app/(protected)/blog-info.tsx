import { getAuthenticatedUserId } from "~/lib/auth";
import prisma from "~/lib/prisma";
import SelectedBlogLink from "./selected-blog-link";
import BlogMenu from "./blog-menu";

export default async function BlogInfo() {
  const userId = await getAuthenticatedUserId();
  const blogs = await prisma.blog.findMany({
    where: {
      userId,
    },
  });

  return (
    <div className="flex items-center">
      <SelectedBlogLink blogs={blogs} />
      <BlogMenu blogs={blogs} />
    </div>
  );
}
