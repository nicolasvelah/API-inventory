import { Router } from 'express';
import TasksController from '../../controllers/v1/tasks-controller';
import Middleware from '../../middlewares/authentication-middleware';
import ValidateTask from '../../middlewares/validate/validate-task';

export default () => {
  const router = Router();
  const middleware = Middleware.getInstance();
  const controller = new TasksController();

  router.post('/create', ValidateTask.createValidation(), controller.create);
  router.post('/update/:id', middleware.verifyToken, ValidateTask.updateValidation(), controller.update);

  router.delete('/:id', middleware.verifyToken, controller.delete);

  router.get('/', controller.getAll);
  router.get('/getGroupByUser', controller.getGroupByUser);
  router.get('/user/:status', middleware.verifyToken, ValidateTask.byUserGetValidation(), controller.getAllByIdUser);
  router.get(
    '/user/:userId/range/:startDate/:endDate',
    controller.getAllByIdUserAndRangeDates
  );

  return router;
};
