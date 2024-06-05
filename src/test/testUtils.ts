import { AppDataSource } from '../database/dbConnection';
import express, { Express } from 'express';
import bodyParser from 'body-parser';
import { router } from '../routes';

export const createTestConnection = async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.dropDatabase();
    await AppDataSource.synchronize();
    await AppDataSource.initialize();
  } else {
    await AppDataSource.initialize();
    await AppDataSource.dropDatabase();
    await AppDataSource.synchronize();
  }
};

export const closeTestConnection = async () => {
  await AppDataSource.destroy();
};

export const resetTestDatabase = async () => {
  await AppDataSource.synchronize(true);
};

export const createServer = async () => {
  const app: Express = express();
  app.use(bodyParser.json());
  app.use('/api/v1', router);

  return app;
};
