import { getUser } from "~/lib/auth";
import prisma from "~/lib/prisma";

import { notFound } from "next/navigation";
import CreateCategoryButton from "./create-category-button";
import { EmptyPlaceholder } from "~/components/empty-placeholder";
import BlogCategoryList from "./blog-category-list";

export default async function CategoriesPage({
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
      categories: { orderBy: { orderIndex: "asc" } },
    },
  });
  if (!blog) {
    notFound();
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight">카테고리</h1>
        <CreateCategoryButton blogId={blog.id} />
      </div>

      {blog.categories.length > 0 ? (
        <BlogCategoryList blog={blog} />
      ) : (
        <EmptyPlaceholder
          title="추가된 카테고리가 없어요."
          description="새로운 카테고리를 추가하고 글을 분류해 보세요."
          action={<CreateCategoryButton blogId={blog.id} />}
        />
      )}
    </div>
  );
}
