import { DataSource } from "typeorm";
import { User } from "../entity/User";
import { AppConstants } from "../utils/appConstants";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: AppConstants.postgresUsername,
  password: AppConstants.postgresPassword,
  database: AppConstants.postgresDB,
  // synchronize: true,   TODO: how to perform manual migration
  logging: true,
  // should we add all models in entities and migrations list?
  entities: [User],
  subscribers: [],
  migrations: [User],
});

export const connectDB = () =>
  AppDataSource.initialize()
    .then(() => {
      // here you can start to work with your database
    })
    .catch((error) => console.log(error));
