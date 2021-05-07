import { Router } from 'express';
import UsersController from '../../controllers/v1/users-controller';
import Middleware from '../../middlewares/authentication-middleware';

export default () => {
  const router = Router();
  const controller = new UsersController();

  //Login user
  router.post('/login', controller.login);

  //Create user
  router.post('/', controller.create);

  //Get users
  router.get('/', Middleware.verifyToken, controller.getAll);
  return router;
};
