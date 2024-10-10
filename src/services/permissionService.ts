import { AppDataSource } from '../database/dbConnection';
import { Permission } from '../database/entity';
import { PermissionInterface, permissionSelectColumns } from '../database/models';

const permissionRepository = AppDataSource.getRepository(Permission);

export const createPermission = async (permissionDetails: PermissionInterface) => {
  const permission = await AppDataSource.createQueryBuilder()
    .insert()
    .into(Permission)
    .values(permissionDetails)
    .returning(permissionSelectColumns)
    .execute();
  return permission.generatedMaps[0];
};

export const getPermission = async (permissionDetails: PermissionInterface) => {
  console.log({ permissionDetails });
  return await permissionRepository.findOne({
    where: [{ role: permissionDetails.role, module_name: permissionDetails.module_name }, { id: permissionDetails.id }],
    relations: ['role'],
  });
};

export const updatePermission = async (id: number, permissionDetails: PermissionInterface) => {
  const permission = await AppDataSource.createQueryBuilder()
    .update(Permission)
    .set(permissionDetails)
    .where('id = :id', { id: id })
    .returning(permissionSelectColumns)
    .execute();
  return permission.raw[0];
};

export const deletePermission = async (id: number) => {
  return await permissionRepository.delete(id);
};
