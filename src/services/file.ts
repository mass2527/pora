import { getSignedURL } from "~/actions/file";
import { ServerError } from "~/lib/errors";
import { tsFetch } from "~/lib/ts-fetch";
import { v4 as uuidv4 } from "uuid";

export async function uploadFileToS3(file: File) {
  const key = uuidv4();
  const result = await getSignedURL(key);
  if (result.status === "failure") {
    throw new ServerError("failed to get signed url", { status: 500 });
  }

  const signedURL = result.data;
  const response = await tsFetch(signedURL, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });
  if (!response.ok) {
    throw new ServerError("Failed to upload file to s3", {
      status: 500,
    });
  }

  return `${process.env.NEXT_PUBLIC_AWS_S3_BASE_URL}/${key}`;
}
