export type UploadOptions = {
  file: File;
  filename: string;
  mimeType: string;
  folder?: string;
};

export type UploadResult = {
  path: string;
  url: string;
};
