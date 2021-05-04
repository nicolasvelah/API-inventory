import { Application } from 'express';
import usersRouter from './users-router';

const apiV1 = (app: Application) => {
  app.get('/', (_, res) => res.send('jekooozK'));
  app.use('/api/v1/users', usersRouter());
};

export default apiV1;
