import { closeTestConnection, createServer, createTestConnection, resetTestDatabase } from './testUtils';
import request from 'supertest';
import { Server } from 'http';
import { AppConstants } from '../config/appConstants';

const BASE_URL = '/api/v1';

let server: Server;

beforeAll(async () => {
  await createTestConnection();
  const app = await createServer();
  server = app.listen(AppConstants.apiPort);
});

afterAll(async () => {
  server.close();
  await closeTestConnection();
});

beforeEach(async () => {
  await resetTestDatabase();
});

describe('user login', () => {
  it('invalid payload should throw validation error', async () => {
    let url: string = BASE_URL + '/auth/signup';
    console.log(' ======= url: ', url);
    // Make a request using Supertest
    const response = await request(server).get(url);

    console.log(' ====== response: ', response.body);

    // Assertions
    // expect(response.status).toBe(200);
    // expect(response.body).toHaveProperty('trials');
  }, 20000);
});
