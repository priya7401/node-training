import { createServer } from '../testUtils';
import request from 'supertest';
import { Express } from 'express';
import { seedAttachmentData } from './seed';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { AppDataSource } from '../../database/dbConnection';

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
    email: 'test6@gmail.com',
    password: 'Password@123',
  };

  let url: string = BASE_URL + '/auth/login';
  // Make a request using Supertest
  let response = await request(app).post(url).send(requestBody);

  jwtToken = response.body.token;
  console.log('jwt token: ', jwtToken);
});

afterAll(async () => {
  await AppDataSource.dropDatabase();
});

jest.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: jest.fn(),
}));

describe('create new attachments', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error for invalid payload', async () => {
    let url: string = BASE_URL + '/attachments/presigned_url';

    let response = await request(app).post(url).set('Authorization', `Bearer ${jwtToken}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('file_name is required, file_type is required');
  }, 20000);

  it('should return s3_key and s3 presigned url for s3 bucket upload', async () => {
    let url: string = BASE_URL + '/attachments/presigned_url';

    let requestBody = {
      file_name: 'test_file_1.pdf',
      file_type: 'application/pdf',
    };

    const expectedUrl = 'https://hello_world_test/s3_upload';

    (getSignedUrl as jest.Mock).mockResolvedValue(expectedUrl);

    let response = await request(app).post(url).set('Authorization', `Bearer ${jwtToken}`).send(requestBody);

    expect(response.status).toBe(201);
    expect(getSignedUrl).toHaveBeenCalled();
    expect(response.body).toHaveProperty('s3_url', expectedUrl);
    expect(response.body).toHaveProperty('s3_key');
    expect(response.body.s3_key).not.toBeNull();
  }, 20000);

  it('should throw error for invalid payload', async () => {
    let url: string = BASE_URL + '/attachments/create_attachment';

    let response = await request(app).put(url).set('Authorization', `Bearer ${jwtToken}`);

    console.log(response.body.message);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('file_name is required, file_type is required, s3_key is required');
  }, 20000);

  it('should create new attachment and return the attachment object', async () => {
    // get s3_key
    let url: string = BASE_URL + '/attachments/presigned_url';

    const getPresignedUrlRequestBody = {
      file_name: 'test_file_1.pdf',
      file_type: 'application/pdf',
    };

    let expectedUrl = 'https://hello_world_test/s3_upload';

    (getSignedUrl as jest.Mock).mockResolvedValue(expectedUrl);

    let response = await request(app).post(url).set('Authorization', `Bearer ${jwtToken}`).send(getPresignedUrlRequestBody);

    // create new attachment record
    url = BASE_URL + '/attachments/create_attachment';

    const createAttachmentRequestBody = {
      file_name: 'test_file_1.pdf',
      file_type: 'application/pdf',
      s3_key: response.body.s3_key,
    };

    expectedUrl = 'https://hello_world_test/s3_download';

    (getSignedUrl as jest.Mock).mockResolvedValue(expectedUrl);

    response = await request(app).put(url).set('Authorization', `Bearer ${jwtToken}`).send(createAttachmentRequestBody);

    expect(response.status).toBe(201);
    expect(getSignedUrl).toHaveBeenCalled();
    expect(response.body).toHaveProperty('attachment');
    expect(response.body.attachment).not.toBeNull();
    expect(response.body).toHaveProperty('attachment.id');
    expect(response.body.attachment.id).not.toBeNull();
    expect(response.body).toHaveProperty('attachment.s3_url', expectedUrl);
    expect(response.body).toHaveProperty('attachment.s3_key');
    expect(response.body.s3_key).not.toBeNull();
  }, 20000);
});

describe('create new project attachment', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error for invalid payload', async () => {
    let url: string = BASE_URL + '/project/attachment';

    let requestBody = {
      id: 1,
    };

    let response = await request(app).post(url).set('Authorization', `Bearer ${jwtToken}`).send(requestBody);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('project_id is required, attachments is required, id is not allowed');
  }, 20000);

  it('should create project attachment', async () => {
    let url: string = BASE_URL + '/project/attachment';

    let requestBody = {
      project_id: 1,
      attachments: [
        {
          attachment_id: 1,
          attachment_type: 'project_documents',
        },
        {
          attachment_id: 2,
          attachment_type: 'temple_images',
        },
      ],
    };

    const expectedUrl = 'https://hello_world_test/s3_download';

    (getSignedUrl as jest.Mock).mockResolvedValue(expectedUrl);

    let response = await request(app).post(url).set('Authorization', `Bearer ${jwtToken}`).send(requestBody);

    console.log(response.body);

    expect(response.status).toBe(201);
    expect(getSignedUrl).toHaveBeenCalled();
    expect(response.body).toHaveProperty('project_attachments');
    expect(response.body.project_attachments).not.toBeNull();
    expect(response.body.project_attachments).toHaveLength(2);
    expect(response.body.project_attachments[0]).toHaveProperty('project_attachment_type', 'temple_images');
    expect(response.body.project_attachments[0]).toHaveProperty('project.id', 1);
    expect(response.body.project_attachments[0]).toHaveProperty(
      'attachment.s3_key',
      '1716996234209-8f99ac93-20c3-4ac2-93c5-e9a1d4123368-test_file_2.pdf',
    );
    expect(response.body.project_attachments[0]).toHaveProperty('attachment.s3_url', expectedUrl);
    expect(response.body.project_attachments[1]).toHaveProperty('project_attachment_type', 'project_documents');
    expect(response.body.project_attachments[1]).toHaveProperty('project.id', 1);
    expect(response.body.project_attachments[1]).toHaveProperty(
      'attachment.s3_key',
      '1716995190939-de0e90bb-6e6c-4600-96ce-b93b04ae2ecd-test_file_1.pdf',
    );
    expect(response.body.project_attachments[1]).toHaveProperty('attachment.s3_url', expectedUrl);
  }, 20000);
});