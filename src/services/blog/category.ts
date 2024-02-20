import { Category } from "@prisma/client";
import { z } from "zod";
import { ResponseError } from "~/lib/errors";
import { tsFetch } from "~/lib/ts-fetch";
import {
  updateCategoriesSchema,
  updateCategorySchema,
} from "~/lib/validations/category";

export async function updateBlogCategories(
  blogId: string,
  values: z.infer<typeof updateCategoriesSchema>
): Promise<Category[]> {
  const response = await tsFetch(`/api/blogs/${blogId}/categories`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });
  if (!response.ok) {
    throw new ResponseError("Bad fetch request", response);
  }

  return response.json();
}

export async function updateBlogCategory(
  blogId: string,
  categoryId: string,
  values: z.infer<typeof updateCategorySchema>
): Promise<Category> {
  const response = await tsFetch(
    `/api/blogs/${blogId}/categories/${categoryId}`,
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

  return response.json();
}

export async function deleteBlogCategory(
  blogId: string,
  categoryId: string
): Promise<Category> {
  const response = await tsFetch(
    `/api/blogs/${blogId}/categories/${categoryId}`,
    {
      method: "DELETE",
    }
  );
  if (!response.ok) {
    throw new ResponseError("Bad fetch response", response);
  }

  return response.json();
}
