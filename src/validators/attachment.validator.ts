import Joi from 'joi';

export const getPresignedUrlValidator = Joi.object({
  file_name: Joi.string().required(),
  file_type: Joi.string().required(),
});

export const createAttachmentValidator = Joi.object({
  file_name: Joi.string().required(),
  file_type: Joi.string().required(),
  s3_key: Joi.string().required(),
});
