import { getUser } from "~/lib/auth";
import prisma from "~/lib/prisma";

import { notFound } from "next/navigation";
import CreateBlogCategoryButton from "./create-blog-category-button";
import { EmptyPlaceholder } from "~/components/empty-placeholder";
import BlogCategoryList from "./blog-category-list";
import BlogOrderSaveStatus from "./blog-order-save-status";
import { assertAuthenticated } from "~/lib/asserts";

export default async function BlogCategoriesPage({
  params,
}: {
  params: { blogSlug: string };
}) {
  const user = await getUser();
  assertAuthenticated(user);

  const blog = await prisma.blog.findUnique({
    where: {
      slug: params.blogSlug,
      userId: user.id,
    },
    include: {
      categories: { orderBy: { orderIndex: "asc" } },
    },
  });
  if (!blog) {
    notFound();
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">카테고리</h1>
          <BlogOrderSaveStatus />
        </div>
        <CreateBlogCategoryButton blogId={blog.id} />
      </div>

      {blog.categories.length > 0 ? (
        <BlogCategoryList blog={blog} />
      ) : (
        <EmptyPlaceholder
          title="추가된 카테고리가 없어요."
          description="새로운 카테고리를 추가하고 글을 분류해 보세요."
          action={<CreateBlogCategoryButton blogId={blog.id} />}
        />
      )}
    </div>
  );
}
