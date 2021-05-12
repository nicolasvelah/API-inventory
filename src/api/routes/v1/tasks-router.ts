import { Router } from 'express';
import TasksController from '../../controllers/v1/tasks-controller';
import Middleware from '../../middlewares/authentication-middleware';

export default () => {
  const router = Router();
  const middleware = Middleware.getInstance();
  const controller = new TasksController();

  router.post('/create', controller.create); // put middleware.verifyToken
  router.delete('/:id', middleware.verifyToken, controller.delete);
  router.get('/', controller.getAll); // middleware.verifyToken
  router.get('/getGroupByUser', controller.getGroupByUser);
  return router;
};
