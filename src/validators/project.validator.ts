import Joi from 'joi';
import { ProjectAttachmentType, ProjectStatus } from '../config/appConstants';

export const getProjectsValidator = Joi.object({
  status: Joi.string()
    .optional()
    .allow(null, '')
    .valid(...Object.values(ProjectStatus)),
});

export const createProjectValidator = Joi.object({
  temple_name: Joi.string().required(),
  temple_incharge_name: Joi.string().required(),
  temple_incharge_number: Joi.string().pattern(RegExp('^(\\+91|\\+91\\-|0)?[789]\\d{9}$')).required(),
  location: Joi.string().required(),
});

export const updateProjectValidator = Joi.object({
  id: Joi.number().required(),
  temple_name: Joi.string(),
  temple_incharge_name: Joi.string(),
  temple_incharge_number: Joi.string().pattern(RegExp('^(\\+91|\\+91\\-|0)?[789]\\d{9}$')),
  status: Joi.string().valid(...Object.values(ProjectStatus)),
  start_date: Joi.string(),
  end_date: Joi.string(),
  estimated_amount: Joi.number(),
  expensed_amount: Joi.number(),
  location: Joi.string(),
  scrapped_reason: Joi.string(),
  // attachment_id: Joi.number(),
  // attachment_type: Joi.string()
  //   .optional()
  //   .allow(null, '')
  //   .valid(...Object.values(ProjectAttachmentType)),
});

export const deleteProjectValidator = Joi.object({
  id: Joi.number().required(),
});

const attachmentDetailsSchema = Joi.object({
  attachment_id: Joi.number().required(),
  attachment_type: Joi.string()
    .valid(...Object.values(ProjectAttachmentType))
    .required(),
});

export const createProjectAttachmentValidator = Joi.object({
  project_id: Joi.number().required(),
  attachments: Joi.array().items(attachmentDetailsSchema).required(),
});