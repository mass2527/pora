import { Article } from "@prisma/client";
import { z } from "zod";
import { ResponseError } from "~/lib/errors";
import { tsFetch } from "~/lib/ts-fetch";
import {
  createBlogArticleSchema,
  updateBlogArticleSchema,
} from "~/lib/validations/article";

export async function updateBlogArticle(
  blogId: string,
  articleId: string,
  values: z.infer<typeof updateBlogArticleSchema>
): Promise<Article> {
  const response = await tsFetch(`/api/blogs/${blogId}/articles/${articleId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });
  if (!response.ok) {
    throw new ResponseError("Bad fetch response", response);
  }

  return response.json();
}

export async function createBlogArticle(
  blogId: string,
  values: z.infer<typeof createBlogArticleSchema>
): Promise<Article> {
  const response = await tsFetch(`/api/blogs/${blogId}/articles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });

  if (!response.ok) {
    throw new ResponseError("Bad fetch response", response);
  }

  return response.json();
}

export async function deleteBlogArticle(
  blogId: string,
  articleId: string
): Promise<Article> {
  const response = await tsFetch(`/api/blogs/${blogId}/articles/${articleId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new ResponseError("Bad fetch response", response);
  }

  return response.json();
}