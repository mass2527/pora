import CreateBlogCategoryButton from "./create-blog-category-button";
import { BlogCategoryListPlaceholder } from "./blog-category-list";
import BlogOrderSaveStatus from "./blog-order-save-status";
import { Suspense } from "react";
import Await from "~/components/await";
import { Button } from "~/components/ui/button";

import { BlogCategories } from "./blog-categories";
import { getBlog } from "./get-blog";

export default async function BlogCategoriesPage({
  params,
}: {
  params: { blogSlug: string };
}) {
  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">카테고리</h1>
          <BlogOrderSaveStatus />
        </div>
        <Suspense fallback={<Button disabled>새 카테고리</Button>}>
          <Await promise={getBlog(params.blogSlug)}>
            {(blog) => <CreateBlogCategoryButton blogId={blog.id} />}
          </Await>
        </Suspense>
      </div>

      <Suspense fallback={<BlogCategoryListPlaceholder />}>
        <BlogCategories blogSlug={params.blogSlug} />
      </Suspense>
    </div>
  );
}
