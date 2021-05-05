import express, { Application } from 'express';
import apiV1 from './api/routes/v1';
import Completer from './helpers/completer';
import injectDependencies from './dependency-injection';

export default class App {
  private app: Application = express();

  initialize = (): Promise<void> => {
    const completer = new Completer<void>();

    injectDependencies()

    apiV1(this.app);

    const PORT = process.env.PORT ?? 5000;
    this.app.listen(PORT, () => {
      console.log('Listen server on port', PORT);
      completer.complete();
    });
    return completer.promise;
  };
}
