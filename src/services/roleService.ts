import { AppDataSource } from '../database/dbConnection';
import { Role } from '../database/entity';
import { RoleInterface, roleSelectedColumns } from '../database/models';

const roleRepository = AppDataSource.getRepository(Role);

export const createRole = async (roleName: string) => {
  const role = roleRepository.create({ role: roleName });
  return await roleRepository.save(role);
};

export const getRoles = async (roleDetails: RoleInterface) => {
  const roles = await roleRepository.find({
    where: [{ id: roleDetails.id }, { role: roleDetails.role }],
    relations: ['permissions'],
  });
  return roles;
};

export const getRoleByIdOrName = async ({ roleId = undefined, roleName = undefined }: { roleId?: number; roleName?: string } = {}) => {
  return await roleRepository.findOne({ where: [{ id: roleId }, { role: roleName }], relations: ['permissions'] });
};

export const updateRole = async (id: number, roleDetails?: RoleInterface) => {
  const updatedRole = await AppDataSource.createQueryBuilder()
    .update(Role)
    .set(roleDetails)
    .where('id = :id', { id: id })
    .returning(roleSelectedColumns)
    .execute();
  const project = updatedRole.raw[0];
  return project;
};

export const deleteRole = async (id: number) => {
  return await roleRepository.delete({ id });
};
