import { Router } from 'express';
import TasksController from '../../controllers/v1/tasks-controller';

export default () => {
  const router = Router();
  const controller = new TasksController();
  router.post('/create', controller.create);
  router.delete('/:id', controller.delete);
  router.get('', controller.getAll);
  return router;
};
