import { Router } from 'express';
import UsersController from '../../controllers/v1/users-controller';

export default () => {
  const router = Router();
  const controller = new UsersController();

  //Login user
  router.post('/login', controller.login);

  //Create user
  router.post('/', controller.create);

  //Get users
  router.get('/', controller.getAll);
  return router;
};
