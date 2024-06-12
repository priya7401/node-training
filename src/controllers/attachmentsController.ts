import { NextFunction, Request, Response } from 'express';
import { HttpStatusCode } from '../config/httpStatusCodes';
import { randomUUID } from 'crypto';
import { getUploadUrl } from '../utils/awsConfig';
import * as attachmentService from '../services/attachmentService';

export const getPresignedUrl = async (req: Request, res: Response, next: NextFunction) => {
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
    next(error);
  }
};

export const createAttachment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { file_name, file_type, s3_key } = req.body;

    // create a new record in DB
    const attachment = await attachmentService.createAttachment({ file_name, file_type, s3_key });

    return res.status(HttpStatusCode.CREATED).json({ attachment });
  } catch (error) {
    next(error);
  }
};
