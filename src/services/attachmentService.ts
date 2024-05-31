import { AppDataSource } from '../database/dbConnection';
import { Attachment } from '../database/entity/Attachment';
import { AttachmentInterface } from '../database/models/attachment';

const attachmentRepository = AppDataSource.getRepository(Attachment);

export const createAttachment = async (attachmentDetails: AttachmentInterface) => {
  const attachment = attachmentRepository.create(attachmentDetails);
  return await attachmentRepository.save(attachment);
};

export const findAttachmentById = async (id: number) => {
  return await attachmentRepository.findOneBy({ id });
};
