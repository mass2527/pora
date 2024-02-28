import { EmptyPlaceholder } from "~/components/empty-placeholder";
import BlogCategoryList from "./blog-category-list";

import CreateBlogCategoryButton from "./create-blog-category-button";
import { getBlog } from "./get-blog";

export async function BlogCategories({ blogSlug }: { blogSlug: string }) {
  const blog = await getBlog(blogSlug);

  return blog.categories.length > 0 ? (
    <BlogCategoryList blog={blog} />
  ) : (
    <EmptyPlaceholder
      title="추가된 카테고리가 없어요."
      description="새로운 카테고리를 추가하고 글을 분류해 보세요."
      action={<CreateBlogCategoryButton blogId={blog.id} />}
    />
  );
}
