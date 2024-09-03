var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/app.ts
import express from "express";
import dotenv from 'dotenv';
import mongoose from 'mongoose';
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
global.__basedir = __dirname + "/";
global.locals = getLocaleMessages();
const connectToDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    const options = {}; // No specific options required
    try {
        yield mongoose.connect(mongoUri, options);
        console.log("Successfully connected to the database");
        //console.log(process.cwd() + "/swagger.css");
    }
    catch (error) {
        console.error("Failed to connect to the database", error);
        process.exit(1); // Exit the process with an error code
    }
});
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    yield connectToDatabase();
    const app = new App().app;
    app.listen(port, () => {
        console.log(`Express is listening at ${getLocalIp()}`);
    });
});
class App {
    constructor() {
        this.app = express();
        this.plugins();
        this.routes();
    }
    plugins() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        const customCss = fs.readFileSync((process.cwd() + "/src/swagger.css"), 'utf8');
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, { customCss }));
    }
    routes() {
        this.app.route("/").get((req, res) => {
            res.send("WELCOME API's");
        });
        this.app.use("/api/users", UserRoute);
    }
}
// Start the server
startServer();
