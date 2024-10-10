import { ModuleType } from '../../config/appConstants';
import { RoleInterface } from '.';

interface PermissionInterface {
  id?: number;
  module_name?: ModuleType | null;
  role?: RoleInterface | null;
  can_create?: boolean | null;
  can_read?: boolean | null;
  can_update?: boolean | null;
  can_delete?: boolean | null;
  created_at?: Date | null;
  updated_at?: Date | null;
}

const permissionSelectColumns = [
  'id',
  'module_name',
  'role',
  'role.id',
  'role.role',
  'can_create',
  'can_read',
  'can_update',
  'can_delete',
  'created_at',
  'updated_at',
];

export { PermissionInterface, permissionSelectColumns };
