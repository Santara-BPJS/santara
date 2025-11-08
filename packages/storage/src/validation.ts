// File type categories
export const IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
] as const;

export const VIDEO_TYPES = [
  "video/mp4",
  "video/mpeg",
  "video/webm",
  "video/quicktime",
] as const;

export const DOCUMENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain",
  "text/csv",
] as const;

export const ARCHIVE_TYPES = [
  "application/zip",
  "application/x-zip-compressed",
  "application/x-rar-compressed",
  "application/x-7z-compressed",
] as const;

export const AUDIO_TYPES = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/ogg",
] as const;

export const ALLOWED_MIME_TYPES = [
  ...IMAGE_TYPES,
  ...VIDEO_TYPES,
  ...DOCUMENT_TYPES,
  ...ARCHIVE_TYPES,
  ...AUDIO_TYPES,
] as const;

export type FileCategory =
  | "image"
  | "video"
  | "document"
  | "archive"
  | "audio"
  | "other";

const KB = 1024;
const MB = KB * KB;

const MAX_FILE_SIZE_MB = 100;
const MAX_IMAGE_SIZE_MB = 10;
const MAX_VIDEO_SIZE_MB = 100;
const MAX_DOCUMENT_SIZE_MB = 25;

export const MAX_FILE_SIZE_KB = MAX_FILE_SIZE_MB * MB;
export const MAX_IMAGE_SIZE_KB = MAX_IMAGE_SIZE_MB * MB;
export const MAX_VIDEO_SIZE_KB = MAX_VIDEO_SIZE_MB * MB;
export const MAX_DOCUMENT_SIZE_KB = MAX_DOCUMENT_SIZE_MB * MB;

// Validation helpers
export function validateMimeType(mimeType: string): boolean {
  return ALLOWED_MIME_TYPES.includes(
    mimeType as (typeof ALLOWED_MIME_TYPES)[number]
  );
}

export function validateFileSize(size: number, mimeType: string): boolean {
  if (IMAGE_TYPES.includes(mimeType as (typeof IMAGE_TYPES)[number])) {
    return size <= MAX_IMAGE_SIZE_KB;
  }
  if (VIDEO_TYPES.includes(mimeType as (typeof VIDEO_TYPES)[number])) {
    return size <= MAX_VIDEO_SIZE_KB;
  }
  if (DOCUMENT_TYPES.includes(mimeType as (typeof DOCUMENT_TYPES)[number])) {
    return size <= MAX_DOCUMENT_SIZE_KB;
  }
  return size <= MAX_FILE_SIZE_KB;
}

export function getFileCategory(mimeType: string): FileCategory {
  if (IMAGE_TYPES.includes(mimeType as (typeof IMAGE_TYPES)[number])) {
    return "image";
  }
  if (VIDEO_TYPES.includes(mimeType as (typeof VIDEO_TYPES)[number])) {
    return "video";
  }
  if (DOCUMENT_TYPES.includes(mimeType as (typeof DOCUMENT_TYPES)[number])) {
    return "document";
  }
  if (ARCHIVE_TYPES.includes(mimeType as (typeof ARCHIVE_TYPES)[number])) {
    return "archive";
  }
  if (AUDIO_TYPES.includes(mimeType as (typeof AUDIO_TYPES)[number])) {
    return "audio";
  }
  return "other";
}

export function sanitizeFilename(filename: string): string {
  // Remove or replace unsafe characters
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, "_")
    .replace(/_{2,}/g, "_")
    .replace(/^_|_$/g, "");
}
