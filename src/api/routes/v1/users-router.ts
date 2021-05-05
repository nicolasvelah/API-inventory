import { Router } from 'express';
import UsersController from '../../controllers/v1/users-controller';

export default () => {
  const router = Router();
  const controller = new UsersController();
  router.post('/create', controller.create);
  router.get('', controller.getAll);
  return router;
};
