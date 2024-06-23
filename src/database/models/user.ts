import { RoleInterface } from './role';

interface UserInterface {
  id?: number;
  name?: string | null;
  mobile_number?: string | null;
  email?: string | null;
  password?: string | null;
  role?: RoleInterface | null;
  created_at?: Date | null;
  updated_at?: Date | null;
  invalidate_token_before?: Date | null;
}

const userSelectColumns = ['id', 'name', 'mobile_number', 'email', 'created_at', 'updated_at'];

export { UserInterface, userSelectColumns };
