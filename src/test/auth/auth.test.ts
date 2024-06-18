import { createServer } from '../testUtils';
import request from 'supertest';
import { messages } from '../../config/messages';
import { seedUserData } from './seed';
import { Express } from 'express';
import { AppDataSource } from '../../database/dbConnection';

const BASE_URL = '/api/v1';

let app: Express;

beforeAll(async () => {
  await seedUserData();
  app = await createServer();
});

afterAll(async () => {
  await AppDataSource.dropDatabase();
});

describe('user signup', () => {
  it('invalid payload should throw validation error', async () => {
    let url: string = BASE_URL + '/auth/signup';

    let requestBody = {};

    let response = await request(app).post(url).send(requestBody);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('mobile_number is required, email is required, password is required');

    requestBody = {
      mobile_number: '98888',
      password: 'ghk',
    };

    response = await request(app).post(url).send(requestBody);
    expect(response.status).toBe(400);
    console.log(response.body);
    expect(response.body.message).toBe(
      'mobile_number with value 98888 fails to match the required pattern: /^(\\+91|\\+91\\-|0)?[789]\\d{9}$/, email is required, password length must be at least 8 characters long, password missing required peer confirm_password',
    );
  }, 20000);

  it('should throw error if user already exists in DB', async () => {
    let requestBody = {
      mobile_number: '9888888881',
      password: 'Password@123',
      confirm_password: 'Password@123',
      email: 'test1@gmail.com',
    };

    let url: string = BASE_URL + '/auth/signup';
    // Make a request using Supertest
    let response = await request(app).post(url).send(requestBody);

    // Assertions
    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ message: messages.userAlreadyExists });
  }, 20000);

  it('should create the new user in the DB', async () => {
    let requestBody = {
      mobile_number: '9888888883',
      password: 'Password@123',
      confirm_password: 'Password@123',
      email: 'test3@gmail.com',
    };

    let url: string = BASE_URL + '/auth/signup';
    // Make a request using Supertest
    let response = await request(app).post(url).send(requestBody);

    // Assertions
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).not.toBeNull();
    expect(response.body.id).not.toBeNull();
    expect(response.body).toHaveProperty('user.mobile_number', '9888888883');
    expect(response.body).toHaveProperty('user.email', 'test3@gmail.com');
    expect(response.body).toHaveProperty('token');
    expect(response.body.token).not.toBeNull();
  }, 20000);
});

describe('user login', () => {
  it('invalid payload should throw validation error', async () => {
    let url: string = BASE_URL + '/auth/login';

    let requestBody = {};

    // Make a request using Supertest
    let response = await request(app).post(url);
    // Assertions
    expect(response.status).toBe(400);
    console.log(response.body);
    expect(response.body.message).toBe('password is required, value must contain at least one of [mobile_number, email]');

    requestBody = {
      mobile_number: '98888',
      password: 'ghk',
    };

    response = await request(app).post(url).send(requestBody);
    expect(response.status).toBe(400);
    console.log(response.body);
    expect(response.body.message).toBe(
      'mobile_number with value 98888 fails to match the required pattern: /^(\\+91|\\+91\\-|0)?[789]\\d{9}$/, password length must be at least 8 characters long',
    );
  }, 20000);

  it('should throw error if user does not exist in DB', async () => {
    let requestBody = {
      mobile_number: '9888888884',
      password: 'Password@123',
      email: 'test4@gmail.com',
    };

    let url: string = BASE_URL + '/auth/login';
    // Make a request using Supertest
    let response = await request(app).post(url).send(requestBody);

    // Assertions
    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({ message: messages.userNotFound });
  }, 20000);

  it('should throw error for incorrect password', async () => {
    let requestBody = {
      mobile_number: '9888888881',
      password: 'Password@12',
    };

    let url: string = BASE_URL + '/auth/login';
    // Make a request using Supertest
    let response = await request(app).post(url).send(requestBody);

    // Assertions
    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({ message: messages.invalidPassword });
  }, 20000);

  it('should return user details along with jwt token', async () => {
    let requestBody = {
      email: 'test1@gmail.com',
      password: 'Password@123',
    };

    let url: string = BASE_URL + '/auth/login';
    // Make a request using Supertest
    let response = await request(app).post(url).send(requestBody);

    // Assertions
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).not.toBeNull();
    expect(response.body.id).not.toBeNull();
    expect(response.body).toHaveProperty('user.mobile_number', '9888888881');
    expect(response.body).toHaveProperty('user.email', 'test1@gmail.com');
    expect(response.body).toHaveProperty('token');
    expect(response.body.token).not.toBeNull();
  }, 20000);
});
