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
  synchronize: AppConstants.nodeEnv == 'test' ? true : false,
  logging: AppConstants.nodeEnv == 'test' ? false : true,
  entities: [User, Project, Attachment, ProjectAttachment],
  subscribers: [],
  migrations: ['src/database/migrations/**/*.ts'],
});

export const connectDB = () =>
  AppDataSource.initialize()
    .then(() => {
      console.log('======= initialized postgres DB and running on port: ', AppConstants.postgresPort);
      // here you can start to work with your database
    })
    .catch((error) => console.log('======= error initializing postgres DB on port: ', error));
