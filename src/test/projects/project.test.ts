import { createServer } from '../testUtils';
import request from 'supertest';
import { seedProjectsData } from './seed';
import { Express } from 'express';
import { messages } from '../../config/messages';
import { AppDataSource } from '../../database/dbConnection';

const BASE_URL = '/api/v1';

let app: Express;

let jwtToken: string;

beforeAll(async () => {
  await seedProjectsData();
  app = await createServer();

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

afterAll(async () => {
  await AppDataSource.dropDatabase();
});

describe('get projects', () => {
  it('should return all the projects', async () => {
    let url: string = BASE_URL + '/projects';

    let response = await request(app).get(url).set('Authorization', `Bearer ${jwtToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('projects');
    expect(response.body.projects).not.toBeNull();
    expect(response.body.projects).toHaveLength(2);
    expect(response.body.projects[0].id).not.toBeNull();
    expect(response.body.projects[1].id).not.toBeNull();
    expect(response.body.projects[1]).toHaveProperty('temple_name', 'temple 1');
    expect(response.body.projects[1]).toHaveProperty('temple_incharge_name', 'temple incharge 1');
    expect(response.body.projects[0]).toHaveProperty('temple_incharge_number', '9999999992');
    expect(response.body.projects[0]).toHaveProperty('location', 'temple 2 location');
    expect(response.body.projects[1]).toHaveProperty('status', 'proposed');
    expect(response.body).toHaveProperty('meta');
  }, 20000);

  it('should return all the projects with the given meta', async () => {
    let url: string = BASE_URL + '/projects';

    let requestBody = {
      per_page: 1,
      page: 1,
    };

    let response = await request(app).get(url).set('Authorization', `Bearer ${jwtToken}`).send(requestBody);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('projects');
    expect(response.body.projects).not.toBeNull();
    expect(response.body.projects).toHaveLength(1);
    expect(response.body.projects[0].id).not.toBeNull();
    expect(response.body.projects[0]).toHaveProperty('temple_incharge_number', '9999999991');
    expect(response.body.projects[0]).toHaveProperty('location', 'temple 1 location');
    expect(response.body).toHaveProperty('meta');
    expect(response.body.meta).not.toBeNull();
    expect(response.body.meta).toHaveProperty('total_pages', 2);
    expect(response.body.meta).toHaveProperty('total_count', 2);
    expect(response.body.meta).toHaveProperty('next_page', 2);
  }, 20000);
});

describe('create project', () => {
  it('should throw error if a project with given temple name already exists', async () => {
    let url: string = BASE_URL + '/project';

    let requestBody = {
      temple_name: 'temple 1',
      temple_incharge_name: 'temple incharge 2',
      temple_incharge_number: '9999999993',
      location: 'temple 3 location',
    };

    let response = await request(app).post(url).set('Authorization', `Bearer ${jwtToken}`).send(requestBody);

    // TODO: change the test case assertions once error handling is implemented for postgres errors
    expect(response.status).toBe(409);
    expect(response.body.message).toBe('temple_name already exists in DB');
  }, 20000);

  it('should throw error for invalid payload', async () => {
    let url: string = BASE_URL + '/project';

    let requestBody = {
      temple_name: 'temple 3',
      temple_incharge_name: 'temple incharge 2',
      temple_incharge_number: '99999',
    };

    let response = await request(app).post(url).set('Authorization', `Bearer ${jwtToken}`).send(requestBody);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      'temple_incharge_number with value 99999 fails to match the required pattern: /^(\\+91|\\+91\\-|0)?[789]\\d{9}$/, location is required',
    );
  }, 20000);

  it('should create a new project', async () => {
    let url: string = BASE_URL + '/project';

    let requestBody = {
      temple_name: 'temple 3',
      temple_incharge_name: 'temple incharge 3',
      temple_incharge_number: '9999999993',
      location: 'temple 3 location',
    };

    let response = await request(app).post(url).set('Authorization', `Bearer ${jwtToken}`).send(requestBody);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('project');
    expect(response.body.project).not.toBeNull();
    expect(response.body.project).toHaveProperty('temple_incharge_number', '9999999993');
    expect(response.body.project).toHaveProperty('location', 'temple 3 location');
    expect(response.body.project).toHaveProperty('temple_name', 'temple 3');
  }, 20000);
});

describe('update project', () => {
  it('invalid payload should throw error', async () => {
    let url: string = BASE_URL + '/project';

    let response = await request(app).put(url).set('Authorization', `Bearer ${jwtToken}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('id is required');
  }, 20000);

  it('invalid project id should throw project not found error', async () => {
    let url: string = BASE_URL + '/project';

    let requestBody = {
      id: 100,
    };

    let response = await request(app).put(url).set('Authorization', `Bearer ${jwtToken}`).send(requestBody);

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({ message: messages.projectNotFound });
  }, 20000);

  it('should update project details', async () => {
    let url: string = BASE_URL + '/project';

    let requestBody = {
      id: 1,
      status: 'planned',
      start_date: '12/06/2024',
      end_date: '10/08/2024',
      estimated_amount: 50000,
    };

    let response = await request(app).put(url).set('Authorization', `Bearer ${jwtToken}`).send(requestBody);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('project');
    expect(response.body.projects).not.toBeNull();
    expect(response.body.project.id).not.toBeNull();
    expect(response.body.project).toHaveProperty('id', 1);
    expect(response.body.project).toHaveProperty('status', 'planned');
    expect(response.body.project).toHaveProperty('start_date');
    expect(response.body.project).toHaveProperty('end_date');
    expect(response.body.project).toHaveProperty('estimated_amount', 50000);
  }, 20000);
});

describe('delete project', () => {
  it('invalid payload should throw error', async () => {
    let url: string = BASE_URL + '/project';

    let response = await request(app).delete(url).set('Authorization', `Bearer ${jwtToken}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('id is required');
  }, 20000);

  it('invalid project id should throw project not found error', async () => {
    let url: string = BASE_URL + '/project';

    let requestBody = {
      id: 100,
    };

    let response = await request(app).delete(url).set('Authorization', `Bearer ${jwtToken}`).send(requestBody);

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({ message: messages.projectNotFound });
  }, 20000);

  it('should delete the project', async () => {
    let url: string = BASE_URL + '/project';

    let requestBody = {
      id: 2,
    };

    let response = await request(app).delete(url).set('Authorization', `Bearer ${jwtToken}`).send(requestBody);

    expect(response.status).toBe(204);
  }, 20000);
});
