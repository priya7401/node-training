import express, { Request, Response } from "express";
import dotenv from "dotenv";

const app = express();

dotenv.config();

const port = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
