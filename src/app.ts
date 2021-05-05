import express, { Application } from 'express';
import apiV1 from './api/routes/v1';
import Completer from './helpers/completer';
import injectDependencies from './dependency-injection';
import MongoDb from './data/db';

export default class App {
  private app: Application = express();

  initialize = async (): Promise<void> => {
    const completer = new Completer<void>();

    const uriMongoDB = process.env.MONGO_URI ?? '';
    const connected = await MongoDb.connect(uriMongoDB);
    if (!connected) return;

    injectDependencies();

    apiV1(this.app);

    const PORT = process.env.PORT ?? 5000;
    this.app.listen(PORT, () => {
      console.log('Server listening on port', PORT);
      completer.complete();
    });
    //return completer.promise;
  };
}
