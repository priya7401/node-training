import { ProjectStatus } from '../../config/appConstants';
import { ProjectAttachmentInterface } from './projectAttachment';

interface ProjectInterface {
  id?: number;
  reg_num?: string | null;
  temple_name?: string | null;
  location?: string | null;
  temple_incharge_name?: string | null;
  temple_incharge_number?: string | null;
  status?: ProjectStatus | null;
  start_date?: Date | null;
  end_date?: Date | null;
  estimated_amount?: number | null;
  expensed_amount?: number | null;
  scrapped_reason?: string | null;
  progress?: number | null;
  created_at?: Date | null;
  updated_at?: Date | null;
  project_attachments?: ProjectAttachmentInterface[] | null;
}

export { ProjectInterface };
