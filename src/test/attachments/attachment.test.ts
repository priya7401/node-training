import { createServer } from '../testUtils';
import request from 'supertest';
import { Express } from 'express';
import { seedAttachmentData } from './seed';
import { getDownloadUrl, getUploadUrl } from '../../utils/awsConfig';

const BASE_URL = '/api/v1';

let app: Express;

let jwtToken: string;

beforeAll(async () => {
  await seedAttachmentData();
  app = await createServer();

  let requestBody = {
    email: 'test6@gmail.com',
    password: 'Password@123',
  };

  let url: string = BASE_URL + '/auth/login';
  // Make a request using Supertest
  let response = await request(app).post(url).send(requestBody);

  jwtToken = response.body.token;
  console.log('jwt token: ', jwtToken);
});

beforeEach(async () => {
  let requestBody = {
    email: 'test5@gmail.com',
    password: 'Password@123',
  };

  let url: string = BASE_URL + '/auth/login';
  // Make a request using Supertest
  let response = await request(app).post(url).send(requestBody);

  jwtToken = response.body.token;
  console.log('jwt token: ', jwtToken);
});

jest.mock('../../utils/awsConfig', () => ({
  getUploadUrl: jest.fn(),
  getDownloadUrl: jest.fn(),
}));

describe('create new attachments', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error for invalid payload', async () => {
    let url: string = BASE_URL + '/attachments/presigned_url';

    let response = await request(app).post(url).set('Authorization', `Bearer ${jwtToken}`);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Error validating request body. "file_name" is required. "file_type" is required.');
  }, 20000);

  it('should return s3_key and s3 presigned url for s3 bucket upload', async () => {
    let url: string = BASE_URL + '/attachments/presigned_url';

    let requestBody = {
      file_name: 'test_file_1.pdf',
      file_type: 'application/pdf',
    };

    const expectedUrl = 'https://hello_world_test/s3_upload';

    (getUploadUrl as jest.Mock).mockResolvedValue(expectedUrl);

    let response = await request(app).post(url).set('Authorization', `Bearer ${jwtToken}`).send(requestBody);

    expect(response.status).toBe(201);
    expect(getUploadUrl).toHaveBeenCalled();
    expect(response.body).toHaveProperty('s3_url', expectedUrl);
    expect(response.body).toHaveProperty('s3_key');
    expect(response.body.s3_key).not.toBeNull();
  }, 20000);

  it('should throw error for invalid payload', async () => {
    let url: string = BASE_URL + '/attachments/create_attachment';

    let response = await request(app).put(url).set('Authorization', `Bearer ${jwtToken}`);

    console.log(response.text);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Error validating request body. "file_name" is required. "file_type" is required. "s3_key" is required.');
  }, 20000);

  it('should create new attachment and return the attachment object', async () => {
    // get s3_key
    let url: string = BASE_URL + '/attachments/presigned_url';

    const getPresignedUrlRequestBody = {
      file_name: 'test_file_1.pdf',
      file_type: 'application/pdf',
    };

    let expectedUrl = 'https://hello_world_test/s3_upload';

    (getUploadUrl as jest.Mock).mockResolvedValue(expectedUrl);

    let response = await request(app).post(url).set('Authorization', `Bearer ${jwtToken}`).send(getPresignedUrlRequestBody);

    // create new attachment record
    url = BASE_URL + '/attachments/create_attachment';

    const createAttachmentRequestBody = {
      file_name: 'test_file_1.pdf',
      file_type: 'application/pdf',
      s3_key: response.body.s3_key,
    };

    expectedUrl = 'https://hello_world_test/s3_download';

    (getDownloadUrl as jest.Mock).mockResolvedValue(expectedUrl);

    response = await request(app).put(url).set('Authorization', `Bearer ${jwtToken}`).send(createAttachmentRequestBody);

    expect(response.status).toBe(201);
    expect(getDownloadUrl).toHaveBeenCalled();
    expect(response.body).toHaveProperty('attachment');
    expect(response.body.attachment).not.toBeNull();
    expect(response.body).toHaveProperty('attachment.id');
    expect(response.body.attachment.id).not.toBeNull();
    expect(response.body).toHaveProperty('attachment.s3_url', expectedUrl);
    expect(response.body).toHaveProperty('attachment.s3_key');
    expect(response.body.s3_key).not.toBeNull();
  }, 20000);
});
