import dotenv from "dotenv";

// set NODE_ENV; default is development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// load env file
const envFile = `.env.${process.env.NODE_ENV}`;
dotenv.config({path: envFile});

export const AppConstants = {
  apiPort: Number(process.env.PORT),
  postgresHost: process.env.POSTGRES_HOST,
  postgresPort: Number(process.env.POSTGRES_PORT),
  postgresUsername: process.env.POSTGRES_USERNAME,
  postgresPassword: process.env.POSTGRES_PASSWORD,
  postgresDB: process.env.POSTGRES_DATABASE,
  saltRounds: Number(process.env.SALT_ROUNDS),
  jwtTokenKey: process.env.JWT_TOKEN_KEY,
  nodeEnv: process.env.NODE_ENV,
  apiV1: "/api/v1",
};
