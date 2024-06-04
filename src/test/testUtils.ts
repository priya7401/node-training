import { DataSource } from 'typeorm';
import { AppDataSource } from '../database/dbConnection';

export const createTestConnection = async (): Promise<DataSource> => {
  return await AppDataSource.initialize();
};

export const closeTestConnection = async (): Promise<void> => {
  await AppDataSource.destroy();
};

export const resetTestDatabase = async (): Promise<void> => {
  await AppDataSource.synchronize(true);
};
