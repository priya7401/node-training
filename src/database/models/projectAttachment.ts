import { ProjectAttachmentType } from '../../config/appConstants';
import { AttachmentInterface } from './attachment';
import { ProjectInterface } from './project';

interface ProjectAttachmentInterface {
  id?: number;
  project?: ProjectInterface | null;
  attachment?: AttachmentInterface | null;
  project_attachment_type?: ProjectAttachmentType | null;
  created_at?: Date | null;
  updated_at?: Date | null;
}

const projectAttachmentSelectColumns = [
  'id',
  'projectId',
  'project_attachment_type',
  'created_at',
  'updated_at',
  'attachmentId',
  // 'attachment.id',
  // 'attachment.s3_key',
  // 'attachment.created_at',
  // 'attachment.updated_at',
];

export { ProjectAttachmentInterface, projectAttachmentSelectColumns };
