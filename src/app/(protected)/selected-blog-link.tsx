"use client";

import { Blog } from "@prisma/client";
import React from "react";
import useSelectedBlog from "./use-selected-blog";
import { buttonVariants } from "~/components/ui/button";
import NewTabLink from "~/components/new-tab-link";

export default function SelectedBlogLink({ blogs }: { blogs: Blog[] }) {
  const selectedBlog = useSelectedBlog(blogs);
  if (!selectedBlog) {
    return null;
  }

  return (
    <NewTabLink
      href={`/blog/${selectedBlog.slug}`}
      className={buttonVariants({ variant: "link" })}
    >
      {selectedBlog.name}
    </NewTabLink>
  );
}
