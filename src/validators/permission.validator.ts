import Joi from 'joi';
import { ModuleType } from '../config/appConstants';

export const createPermissionValidator = Joi.object({
  module_name: Joi.string()
    .valid(...Object.values(ModuleType))
    .required(),
  role_id: Joi.number().required(),
  can_create: Joi.boolean(),
  can_read: Joi.boolean(),
  can_update: Joi.boolean(),
  can_delete: Joi.boolean(),
});

export const getPermissionValidator = Joi.object({
  permission_id: Joi.number(),
  module_name: Joi.string().valid(...Object.values(ModuleType)),
  role_name: Joi.string(),
})
  .or('permission_id', 'module_name')
  .with('module_name', 'role_name')
  .with('role_name', 'module_name');

export const updatePermissionValidator = Joi.object({
  permission_id: Joi.number().required(),
  module_name: Joi.string().valid(...Object.values(ModuleType)),
  role_name: Joi.string(),
  can_create: Joi.boolean(),
  can_read: Joi.boolean(),
  can_update: Joi.boolean(),
  can_delete: Joi.boolean(),
});

export const deletePermissionValidator = Joi.object({
  permission_id: Joi.number().required(),
});
