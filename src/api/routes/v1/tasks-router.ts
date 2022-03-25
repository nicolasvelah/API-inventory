import { Router } from 'express';
import TasksController from '../../controllers/v1/tasks-controller';
import Middleware from '../../middlewares/authentication-middleware';
import ValidateTask from '../../middlewares/validate/validate-task';

export default () => {
  const router = Router();
  const middleware = Middleware.getInstance();
  const controller = new TasksController();

  //WEB
  router.post('/create', middleware.verifyToken, ValidateTask.createValidation(), controller.create);
  router.get('/', middleware.verifyToken, ValidateTask.getAllValidation(), controller.getAll);

  //APP
  router.post('/update/:id', middleware.verifyToken, ValidateTask.updateValidation(), controller.update);
  router.get('/user/:status', middleware.verifyToken, ValidateTask.byUserGetValidation(), controller.getAllByIdUser);

  // rutas a revisar no urgentes
  router.delete('/:id', middleware.verifyToken, controller.delete);
  router.get('/getGroupByUser', controller.getGroupByUser);
  router.get(
    '/user/:userId/range/:startDate/:endDate',
    controller.getAllByIdUserAndRangeDates
  );

  return router;
};
