import { PutBlobResult } from "@vercel/blob";
import { ServerError } from "~/lib/errors";
import { tsFetch } from "~/lib/ts-fetch";

export async function uploadFile(file: File): Promise<PutBlobResult> {
  const response = await tsFetch("/api/upload", {
    method: "POST",
    headers: {
      "content-type": file.type,
      "x-vercel-filename": encodeURIComponent(file.name),
    },
    body: file,
  });
  if (!response.ok) {
    if (response.status === 401) {
      throw new ServerError(
        "`BLOB_READ_WRITE_TOKEN` environment variable not found.",
        {
          status: 401,
        }
      );
    }

    throw new ServerError("Failed to upload file", {
      status: 500,
    });
  }

  return response.json();
}

export function deleteFile(url: string) {
  tsFetch(`/api/upload?url=${url}`, {
    method: "DELETE",
  });
}
