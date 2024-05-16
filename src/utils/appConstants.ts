import dotenv from "dotenv";

dotenv.config();

export const AppConstants = {
  apiPort: process.env.PORT,
  postgresUsername: process.env.POSTGRES_USERNAME,
  postgresPassword: process.env.POSTGRES_PASSWORD,
  postgresDB: process.env.POSTGRES_DATABASE,
  saltRounds: Number(process.env.SALT_ROUNDS),
};
