import { Request, Response } from 'express';
import { HttpStatusCode } from '../config/httpStatusCodes';
import { messages } from '../config/messages';
import { randomUUID } from 'crypto';
import { getDownloadUrl, getUploadUrl } from '../utils/awsConfig';
import * as attachmentService from '../services/attachmentService';
import { AttachmentInterface } from '../database/models/attachment';

export const getPresignedUrl = async (req: Request, res: Response) => {
  try {
    const { file_name } = req.body;

    //generate unique key for the attachment
    const key = `${Date.now()}-${randomUUID()}-${file_name}`;

    const preSignedUrl = await getUploadUrl(key);

    return res.status(HttpStatusCode.CREATED).json({
      s3_url: preSignedUrl,
      s3_key: key,
    });
  } catch (error) {
    console.log(error);
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(messages.internalServerError);
  }
};

export const createAttachment = async (req: Request, res: Response) => {
  try {
    const { file_name, file_type, s3_key } = req.body;

    // create a new record in DB
    const attachment: AttachmentInterface = await attachmentService.createAttachment({ file_name, file_type, s3_key });

    // get the presigned url
    const presignedUrl = await getDownloadUrl(s3_key);
    attachment.s3_url = presignedUrl;
    return res.status(HttpStatusCode.CREATED).json({ attachment });
  } catch (error) {
    console.log(error);
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(messages.internalServerError);
  }
};
