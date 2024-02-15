"use client";

import { Article, ArticleStatus, Blog } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Loading } from "~/components/ui/loading";
import { ResponseError, handleError } from "~/lib/errors";
import { createArticleSchema } from "~/lib/validations/article";
import { atom, useAtom } from "jotai";
import { tsFetch } from "~/lib/ts-fetch";

const isLoadingAtom = atom(false);

export default function CreateArticleButton({ blog }: { blog: Blog }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);

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
          const response = await tsFetch(`/api/blogs/${blog.id}/articles`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              categoryId: undefined,
              slug: crypto.randomUUID(),
              title: "",
              draftTitle: "",
              description: "",
              jsonContent: JSON.stringify({}),
              draftJsonContent: JSON.stringify({}),
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
