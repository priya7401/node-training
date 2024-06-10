// import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
// import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const mockS3Client = {
  send: jest.fn(),
};

const mockGetSignedUrl = jest.fn();

jest.mock('@aws-sdk/client-s3', () => {
  return {
    S3Client: jest.fn(() => mockS3Client),
    PutObjectCommand: jest.fn(),
    GetObjectCommand: jest.fn(),
  };
});

jest.mock('@aws-sdk/s3-request-presigner', () => {
  return {
    getSignedUrl: mockGetSignedUrl,
  };
});

export { mockS3Client, mockGetSignedUrl };
