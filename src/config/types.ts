import { ProjectAttachmentType } from './appConstants';

interface AttachmentDetails {
  attachment_id?: number;
  attachment_type?: ProjectAttachmentType | null;
}

export { AttachmentDetails };
