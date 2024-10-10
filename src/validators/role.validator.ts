import Joi from 'joi';

export const createRoleValidator = Joi.object({
  role_name: Joi.string().required(),
});

export const getRolesValidator = Joi.object({
  role_id: Joi.number(),
  role_name: Joi.string(),
});

export const getRoleByIdOrNameValidator = Joi.object({
  role_id: Joi.number(),
  role_name: Joi.string(),
}).or('role_id', 'role_name');

export const updateRoleValidator = Joi.object({
  role_id: Joi.number().required(),
  role_name: Joi.string(),
});

export const deleteRoleValidator = Joi.object({
  role_id: Joi.number().required(),
});
