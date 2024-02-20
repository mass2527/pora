import { Blog } from "@prisma/client";
import { ResponseError } from "~/lib/errors";
import { tsFetch } from "~/lib/ts-fetch";

export async function deleteBlog(blogId: string): Promise<Blog> {
  const response = await tsFetch(`/api/blogs/${blogId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new ResponseError("Bad fetch response", response);
  }

  return response.json();
}
