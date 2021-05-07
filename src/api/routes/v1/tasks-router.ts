import { Router } from 'express';
import TasksController from '../../controllers/v1/tasks-controller';
import Middleware from '../../middlewares/authentication-middleware';

export default () => {
  const router = Router();
  const middleware = Middleware.getInstance();
  const controller = new TasksController();

  router.post('/', middleware.verifyToken, controller.create);
  router.delete('/:id', middleware.verifyToken, controller.delete);
  router.get('/', middleware.verifyToken, controller.getAll);
  return router;
};
