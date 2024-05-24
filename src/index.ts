import express, { Express } from 'express';
import { connectDB } from './database/dbConnection';
import { AppConstants } from './config/appConstants';
import bodyParser from 'body-parser';
import { router } from './routes';

const app: Express = express();

//used when query is sent inside body
app.use(bodyParser.json());
//defining base url
app.use('/api/v1', router);

connectDB();

app.listen(AppConstants.apiPort, () => {
  console.log(`Example app listening on port ${AppConstants.apiPort}`);
});
