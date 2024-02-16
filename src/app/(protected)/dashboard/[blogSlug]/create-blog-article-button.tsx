"use client";

import { ArticleStatus, Blog } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Loading } from "~/components/ui/loading";
import { handleError } from "~/lib/errors";
import { useAtom } from "jotai";
import { createBlogArticle } from "~/services/blog/article";
import { createBlogArticleLoadingAtom } from "./create-blog-article-loading-atom";

export default function CreateBlogArticleButton({ blog }: { blog: Blog }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useAtom(createBlogArticleLoadingAtom);

  useEffect(() => {
    return () => {
      setIsLoading(false);
    };
  }, [setIsLoading]);

  return (
    <Button
      type="button"
      onClick={async () => {
        try {
          setIsLoading(true);
          const article = await createBlogArticle(blog.id, {
            slug: crypto.randomUUID(),
            title: "",
            draftTitle: "",
            description: "",
            jsonContent: JSON.stringify({}),
            draftJsonContent: JSON.stringify({}),
            htmlContent: "",
            status: ArticleStatus.WRITING,
          });
          router.push(`/dashboard/${blog.slug}/${article.slug}/edit`);
        } catch (error) {
          setIsLoading(false);
          handleError(error);
        }
      }}
      disabled={isLoading}
    >
      {isLoading ? <Loading /> : "새 아티클"}
    </Button>
  );
}
