"use client";

import { Article, ArticleStatus, Blog } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Loading } from "~/components/ui/loading";
import { ResponseError, handleError } from "~/lib/errors";
import { createArticleSchema } from "~/lib/validations/article";

export default function CreateArticleButton({ blog }: { blog: Blog }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Button
      type="button"
      onClick={async () => {
        try {
          setIsLoading(true);
          const response = await fetch(`/api/blogs/${blog.id}/articles`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              categoryId: undefined,
              slug: crypto.randomUUID(),
              title: "",
              description: "",
              jsonContent: JSON.stringify({}),
              htmlContent: "",
              status: ArticleStatus.WRITING,
            } satisfies z.infer<typeof createArticleSchema>),
          });
          if (!response.ok) {
            throw new ResponseError("Bad fetch response", response);
          }

          const article = (await response.json()) as Article;
          router.refresh();
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
