import express, { Application } from 'express';
import apiV1 from './api/routes/v1';
import Completer from './helpers/completer';

export default class App {
  private app: Application = express();

  initialize = (): Promise<void> => {
    const completer = new Completer<void>();
    apiV1(this.app);
    this.app.listen(5000, () => {
      completer.complete();
    });
    return completer.promise;
  };
}
