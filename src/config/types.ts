import { CRUDOperation, ModuleType, ProjectAttachmentType, Role } from './appConstants';

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

interface PermissionCheckParams {
  allowedRoles: Role[];
  module: ModuleType;
  operation: CRUDOperation;
}

export { AttachmentDetails, Meta, PermissionCheckParams };
