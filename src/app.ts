// src/app.ts
import express, { Application, Request, Response } from "express";
import dotenv from 'dotenv';
import mongoose, { ConnectOptions } from 'mongoose';
import fs from 'fs';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json' assert { type: 'json' };
import { getLocalIp, getLocaleMessages } from "./helpers/helper.js";
import UserRoute from './routes/user.routes.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const port = process.env.PORT;
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error("MONGO_URI is not defined");
}

declare global {
  var __basedir: string;
  var locals: Record<string, string>;
}
global.__basedir = __dirname + "/";
global.locals = getLocaleMessages();


const connectToDatabase = async (): Promise<void> => {
  const options: ConnectOptions = {}; // No specific options required
  try {
    await mongoose.connect(mongoUri, options);
    console.log("Successfully connected to the database");
    //console.log(process.cwd() + "/swagger.css");
  } catch (error) {
    console.error("Failed to connect to the database", error);
    process.exit(1); // Exit the process with an error code
  }
};

const startServer = async () => {
  await connectToDatabase();

  const app = new App().app;
  app.listen(port, () => {
    console.log(`Express is listening at ${getLocalIp()}`);
  });
};


class App {
  public app: Application;

  constructor() {
    this.app = express();

    this.plugins();
    this.routes();
  }

  protected plugins(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    const customCss = fs.readFileSync((process.cwd() + "/src/swagger.css"), 'utf8');
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, { customCss }));
  }
  protected routes(): void {
    this.app.route("/").get((req: Request, res: Response) => {
      res.send("WELCOME API's");
    });
    this.app.use("/api/users", UserRoute);
  }
}


// Start the server
startServer();
