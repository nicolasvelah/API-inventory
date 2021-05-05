import { Application } from 'express';
import usersRouter from './users-router';
import placesRouter from './places-router';
import tasksRouter from './tasks-router';

const apiV1 = (app: Application) => {
  app.get('/', (_, res) => res.send('jekooozK'));
  app.use('/api/v1/users', usersRouter());
  app.use('/api/v1/places', placesRouter());
  app.use('/api/v1/tasks', tasksRouter());
};

export default apiV1;
