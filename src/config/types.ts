import { ProjectAttachmentType } from './appConstants';

interface AttachmentDetails {
  attachment_id?: number;
  attachment_type?: ProjectAttachmentType | null;
}

interface Meta {
  total_pages?: number | null;
  total_count?: number | null;
  page?: number | null;
  next_page?: number | null;
  per_page?: number | null;
}

export { AttachmentDetails, Meta };
