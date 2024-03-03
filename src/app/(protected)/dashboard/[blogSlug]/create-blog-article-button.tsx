"use client";

import { ArticleStatus, Blog } from "@prisma/client";
import { usePathname } from "next/navigation";
import React from "react";
import { Button } from "~/components/ui/button";
import { Loading } from "~/components/ui/loading";
import { handleError, throwServerError } from "~/lib/errors";
import { useAtom } from "jotai";

import { createBlogArticleLoadingAtom } from "./create-blog-article-loading-atom";
import { createArticle } from "./actions";

export default function CreateBlogArticleButton({ blog }: { blog: Blog }) {
  const [isLoading, setIsLoading] = useAtom(createBlogArticleLoadingAtom);
  const pathname = usePathname();

  return (
    <Button
      type="button"
      onClick={async () => {
        try {
          setIsLoading(true);
          const response = await createArticle(
            blog.id,
            {
              slug: crypto.randomUUID(),
              title: "",
              draftTitle: "",
              description: "",
              jsonContent: JSON.stringify({}),
              draftJsonContent: JSON.stringify({}),
              htmlContent: "",
              status: ArticleStatus.WRITING,
            },
            pathname
          );
          if (response.status === "failure") {
            throwServerError(response);
          }

          const article = response.data;
          window.open(
            `/dashboard/${blog.slug}/${article.slug}/edit`,
            "_blank",
            "noopener"
          );
        } catch (error) {
          handleError(error);
        } finally {
          setIsLoading(false);
        }
      }}
      disabled={isLoading}
    >
      {isLoading ? <Loading /> : "새 아티클"}
    </Button>
  );
}
