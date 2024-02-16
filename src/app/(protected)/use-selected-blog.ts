import { Blog } from "@prisma/client";
import { useSelectedLayoutSegments } from "next/navigation";

export default function useSelectedBlog(blogs: Blog[]) {
  const selectedLayoutSegments = useSelectedLayoutSegments();
  const selectedBlogSlug =
    selectedLayoutSegments[0] === "dashboard"
      ? selectedLayoutSegments[1]
      : null;
  const selectedBlog = blogs.find((blog) => blog.slug === selectedBlogSlug);

  return selectedBlog;
}
