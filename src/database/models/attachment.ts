interface AttachmentInterface {
  id?: number;
  file_name?: string | null;
  file_type?: string | null;
  s3_key?: string | null;
  created_at?: Date | null;
  updated_at?: Date | null;
}

const attachmentSelectColumns = ['id', 'file_name', 'file_type', 's3_key', 's3_url', 'created_at', 'updated_at'];

export { AttachmentInterface, attachmentSelectColumns };
