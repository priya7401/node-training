import { DataSource } from 'typeorm';
import { AppConstants } from '../config/appConstants';
import { Attachment, Project, ProjectAttachment, User } from './entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: AppConstants.postgresHost,
  port: AppConstants.postgresPort,
  username: AppConstants.postgresUsername,
  password: AppConstants.postgresPassword,
  database: AppConstants.postgresDB,
  // synchronize: true,
  logging: true,
  entities: [User, Project, Attachment, ProjectAttachment],
  subscribers: [],
  migrations: ['src/database/migrations/**/*.ts'],
});

export const connectDB = () =>
  AppDataSource.initialize()
    .then(() => {
      // here you can start to work with your database
    })
    .catch((error) => console.log(error));
