import Joi from 'joi';

export const updateUserValidator = Joi.object({
  user_id: Joi.number().required(),
  name: Joi.string(),
  role_name: Joi.string(),
});
