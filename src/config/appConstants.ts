import dotenv from 'dotenv';

dotenv.config();

export const AppConstants = {
  apiPort: Number(process.env.PORT),
  postgresHost: process.env.POSTGRES_HOST,
  postgresPort: Number(process.env.POSTGRES_PORT),
  postgresUsername: process.env.POSTGRES_USERNAME,
  postgresPassword: process.env.POSTGRES_PASSWORD,
  postgresDB: process.env.POSTGRES_DATABASE,
  saltRounds: Number(process.env.SALT_ROUNDS),
  jwtTokenKey: process.env.JWT_TOKEN_KEY,
};

export enum ProjectStatus {
  proposed = 'proposed',
  planned = 'planned',
  active = 'active',
  completed = 'completed',
  scrapped = 'scrapped',
}