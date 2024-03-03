"use server";

import { ServerActionResponse } from "~/types";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getUser } from "~/lib/auth";

const s3Client = new S3Client({
  region: process.env.AWS_BUCKET_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function getSignedURL(
  key: string
): Promise<ServerActionResponse<string>> {
  try {
    const user = await getUser();
    if (!user) {
      return {
        status: "failure",
        error: {
          message: "Unauthorized",
          status: 401,
        },
      };
    }

    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
    });
    const signedUrl = await getSignedUrl(s3Client, putObjectCommand, {
      expiresIn: 60,
    });
    return {
      status: "success",
      data: signedUrl,
    };
  } catch (error) {
    return {
      status: "failure",
      error: {
        message: "Unknown",
        status: 500,
      },
    };
  }
}

export async function deleteFileFromS3(s3ObjectUrl: string) {
  const key = s3ObjectUrl.split(
    `https://${process.env.AWS_BUCKET_NAME}.s3.ap-northeast-2.amazonaws.com/`
  )[1];

  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
    })
  );
}
