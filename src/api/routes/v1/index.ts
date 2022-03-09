import { Application } from 'express';
import usersRouter from './users-router';
import placesRouter from './places-router';
import tasksRouter from './tasks-router';
import inventoriesRouter from './inventories-router';
import catalogsRouter from './catalogs-router';
import categoriesRouter from './categories-router';

const apiV1 = (app: Application) => {
  app.get('/', (_, res) => res.send('jekooozK'));
  app.use('/api/v1/users', usersRouter());
  app.use('/api/v1/places', placesRouter());
  app.use('/api/v1/tasks', tasksRouter());
  app.use('/api/v1/inventories', inventoriesRouter());
  app.use('/api/v1/catalogs', catalogsRouter());
  app.use('/api/v1/categories', categoriesRouter());
};

export default apiV1;
