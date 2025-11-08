import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "cloudflare:workers";
import type { UploadOptions, UploadResult } from "./types";

export type S3Config = {
  region: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
  endpoint?: string;
  forcePathStyle?: boolean;
};

const client = new S3Client({
  credentials: {
    accessKeyId: env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_S3_SECRET_ACCESS_KEY,
  },
  endpoint: env.AWS_S3_ENDPOINT,
  region: env.AWS_S3_REGION,
});

const bucket = env.AWS_S3_BUCKET;

async function uploadFile(options: UploadOptions): Promise<UploadResult> {
  const path = options.folder
    ? `${options.folder}/${options.filename}`
    : options.filename;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: path,
    Body: options.file,
    ContentType: options.mimeType,
  });

  await client.send(command);

  const url = await getFileUrl(path);

  return {
    path,
    url,
  };
}

async function deleteFile(path: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: path,
  });

  await client.send(command);
}

async function getFileUrl(path: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: path,
  });

  // Generate signed URL valid for 1 hour
  const url = await getSignedUrl(client, command, { expiresIn: 3600 });
  return url;
}

async function isFileExists(path: string): Promise<boolean> {
  try {
    const command = new HeadObjectCommand({
      Bucket: bucket,
      Key: path,
    });

    await client.send(command);
    return true;
  } catch {
    return false;
  }
}

export const s3StorageProvider = {
  upload: uploadFile,
  delete: deleteFile,
  getUrl: getFileUrl,
  exists: isFileExists,
};
