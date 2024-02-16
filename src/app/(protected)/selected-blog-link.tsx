"use client";

import { Blog } from "@prisma/client";
import React from "react";
import useSelectedBlog from "./use-selected-blog";
import Link from "next/link";
import { buttonVariants } from "~/components/ui/button";

export default function SelectedBlogLink({ blogs }: { blogs: Blog[] }) {
  const selectedBlog = useSelectedBlog(blogs);
  if (!selectedBlog) {
    return null;
  }

  return (
    <Link
      href={`/${selectedBlog.slug}`}
      target="_blank"
      className={buttonVariants({ variant: "link" })}
    >
      {selectedBlog.name}
    </Link>
  );
}
