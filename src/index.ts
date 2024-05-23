import express, { Express } from "express";
import { connectDB } from "./database/dbConnection";
import { AppConstants } from "./config/appConstants";
import bodyParser from "body-parser";
import { router } from "./routes";

const app: Express = express();

//used when query is sent inside body
app.use(bodyParser.json());
//defining base url
app.use(AppConstants.apiV1, router);

if (AppConstants.nodeEnv != "test") {
  connectDB();

  app.listen(AppConstants.apiPort, () => {
    console.log(`Example app listening on port ${AppConstants.apiPort}`);
  });
}

export default app;