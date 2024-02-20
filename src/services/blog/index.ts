import { Blog } from "@prisma/client";
import { z } from "zod";
import { ResponseError } from "~/lib/errors";
import { tsFetch } from "~/lib/ts-fetch";
import { createBlogSchema } from "~/lib/validations/blog";

export async function deleteBlog(blogId: string): Promise<Blog> {
  const response = await tsFetch(`/api/blogs/${blogId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new ResponseError("Bad fetch response", response);
  }

  return response.json();
}

export async function createBlog(
  values: z.infer<typeof createBlogSchema>
): Promise<Blog> {
  const response = await tsFetch("/api/blogs", {
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
