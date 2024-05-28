import { DataSource } from 'typeorm';
import { User } from './entity/User';
import { AppConstants } from '../config/appConstants';
import { Project } from './entity/Project';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: AppConstants.postgresHost,
  port: AppConstants.postgresPort,
  username: AppConstants.postgresUsername,
  password: AppConstants.postgresPassword,
  database: AppConstants.postgresDB,
  // synchronize: true,
  logging: true,
  entities: [User, Project],
  subscribers: [],
  migrations: ['src/database/migrations/**/*.ts'],
});

export const connectDB = () =>
  AppDataSource.initialize()
    .then(() => {
      // here you can start to work with your database
    })
    .catch((error) => console.log(error));
