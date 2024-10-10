import { PermissionInterface } from './permission';
import { UserInterface } from './user';

interface RoleInterface {
  id?: number;
  role?: string | null;
  users?: UserInterface[] | null;
  permissions?: PermissionInterface[] | null;
  created_at?: Date | null;
  updated_at?: Date | null;
}

const roleSelectedColumns = ['id', 'role', 'users', 'permissions', 'created_at', 'updated_at'];

export { RoleInterface, roleSelectedColumns };
