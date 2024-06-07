import { closeTestConnection, createServer, createTestConnection } from '../testUtils';
import request from 'supertest';
import { Server } from 'http';
import { AppConstants } from '../../config/appConstants';
import { seedProjectsData } from './seed';

const BASE_URL = '/api/v1';

let server: Server;

beforeAll(async () => {
  await seedProjectsData();
  await createTestConnection();
  const app = await createServer();
  server = app.listen(AppConstants.apiPort);
});

afterAll(async () => {
  server.close();
  await closeTestConnection();
});

describe('projects', () => {
  it('should return all the projects', async () => {
    let url: string = BASE_URL + '/projects';

    let response = await request(server).get(url);

    console.log(response.body);

    // expect(response.status).toBe(200);
    // expect(response.body).toHaveProperty('projects');
    // expect(response.body.projects).not.toBeNull();
    // expect(response.body.projects).toHaveLength(2);
    // expect(response.body.projects[0].id).not.toBeNull();
    // expect(response.body.projects[1].id).not.toBeNull();
    // expect(response.body.projects[0]).toHaveProperty('temple_name', 'temple 1');
    // expect(response.body.projects[0]).toHaveProperty('temple_incharge_name', 'temple incharge 1');
    // expect(response.body.projects[1]).toHaveProperty('temple_incharge_number', '9999999992');
    // expect(response.body.projects[1]).toHaveProperty('location', 'temple 2 location');

    // expect(response.body).toHaveProperty('meta');
  }, 20000);
});
