import { PutBlobResult } from "@vercel/blob";
import { ResponseError } from "~/lib/errors";

export async function uploadFile(file: File): Promise<PutBlobResult> {
  const response = await fetch("/api/upload", {
    method: "POST",
    headers: {
      "content-type": file.type,
      "x-vercel-filename": encodeURIComponent(file.name),
    },
    body: file,
  });
  if (!response.ok) {
    if (response.status === 401) {
      throw new ResponseError(
        "`BLOB_READ_WRITE_TOKEN` environment variable not found.",
        response
      );
    }

    throw new ResponseError("Failed to upload file", response);
  }

  return response.json();
}

export function deleteFile(url: string) {
  fetch(`/api/upload?url=${url}`, {
    method: "DELETE",
  });
}
