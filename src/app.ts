import express, { Application } from 'express';
import cors from 'cors';
import http from 'http';
import { json, urlencoded } from 'body-parser';
import apiV1 from './api/routes/v1';
import Completer from './helpers/completer';
import injectDependencies from './dependency-injection';
import MongoDb from './data/db';
import FirebaseAdmin from './data/providers/remote/firebase-admin';
import EmailManager from './helpers/email-manager';
import validationMiddlewareParams from './api/middlewares/validate/index';

export default class App {
  private app: Application = express();

  private server?: http.Server;

  /**
   * enable the api cors, body parser
   * this method must be called after create proxies
   */
  private enableCors = () => {
    this.app.use(cors()); // enable cors
    this.app.use(json()); // convert the incomming request to json
    this.app.use(urlencoded({ extended: false })); // urlencoded to false
  };

  private validationMiddleware = () => {
    this.app.use(validationMiddlewareParams);
  };

  initialize = async (): Promise<void> => {
    const completer = new Completer<void>();

    //Connect MongoDB
    const uriMongoDB = process.env.MONGO_URI ?? '';
    const connected = await MongoDb.connect(uriMongoDB);
    if (!connected) return;

    //initialize firebase
    FirebaseAdmin.getInstance();

    //initialize nodemail
    EmailManager.getInstance();

    this.server = new http.Server(this.app);
    injectDependencies('/v1', this.server);
    this.enableCors();

    apiV1(this.app);

    // validation middleware
    this.validationMiddleware();

    const PORT = process.env.PORT ?? 5000;
    this.server.listen(PORT, () => {
      console.log('Server listening on port', PORT);
      completer.complete();
    });
    //return completer.promise;
  };
}
