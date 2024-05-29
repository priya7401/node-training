import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { AppConstants } from '../config/appConstants';

const s3Client = new S3Client({
  credentials: {
    accessKeyId: AppConstants.AWSaccessKeyId ?? '',
    secretAccessKey: AppConstants.AWSsecretAccessKey ?? '',
  },
  region: AppConstants.AWSregion,
});

const bucket = AppConstants.AWSbucket;

const s3UploadParams = {
  Bucket: bucket,
  Key: '',
};

export const getUploadUrl = async (key: string) => {
  s3UploadParams.Key = key;

  const command = new PutObjectCommand(s3UploadParams);

  const preSignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 600 });

  return preSignedUrl;
};

export const getDownloadUrl = async (key: string) => {
  if (!key || key === '') {
    return '';
  }

  s3UploadParams.Key = key;

  const command = new GetObjectCommand(s3UploadParams);

  const preSignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 600 });

  return preSignedUrl;
};
