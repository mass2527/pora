"use client";

import React from "react";
import { Button } from "~/components/ui/button";
import { Loading } from "~/components/ui/loading";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { ResponseError, handleError } from "~/lib/errors";
import { articleSchema } from "~/lib/validations/article";
import { useRouter } from "next/navigation";
import ArticleForm from "~/components/article-form";

export default function EditArticleForm({
  article,
}: {
  article: Prisma.ArticleGetPayload<{
    include: { blog: { include: { categories: true } } };
  }>;
}) {
  const router = useRouter();

  return (
    <ArticleForm
      article={article}
      onSubmit={async (values, form) => {
        try {
          const response = await fetch(
            `/api/blogs/${article.blog.id}/articles/${article.id}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(values),
            }
          );
          if (!response.ok) {
            throw new ResponseError("Bad fetch response", response);
          }

          router.replace(`/dashboard/${article.blog.slug}`);
        } catch (error) {
          if (error instanceof ResponseError) {
            if (error.response.status === 409) {
              const json = (await error.response.json()) as {
                target: [string, keyof z.infer<typeof articleSchema>];
              };
              const [, name] = json.target;

              form.setError(name, {
                message: `이미 존재하는 슬러그입니다.`,
              });
            }
            return;
          }

          handleError(error);
        }
      }}
      renderAction={(formState) => {
        return (
          <div className="flex gap-2 ml-auto">
            <Button
              type="submit"
              disabled={formState.isSubmitting || !formState.isDirty}
            >
              {formState.isSubmitting ? <Loading /> : "수정"}
            </Button>
          </div>
        );
      }}
      defaultValues={{
        categoryId: article.categoryId,
        slug: article.slug,
        title: article.title,
        description: article.description ?? undefined,
        content: article.content,
      }}
    />
  );
}
