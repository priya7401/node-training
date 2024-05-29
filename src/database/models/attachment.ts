interface AttachmentInterface {
  id?: number;
  file_name?: string | null;
  file_type?: string | null;
  s3_key?: string | null;
  s3_url?: string | null;
  created_at?: Date | null;
  updated_at?: Date | null;
}

export { AttachmentInterface };
