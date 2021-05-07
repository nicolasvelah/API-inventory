import { Router } from 'express';
import UsersController from '../../controllers/v1/users-controller';
import Middleware from '../../middlewares/authentication-middleware';

export default () => {
  const router = Router();
  const controller = new UsersController();
  const middleware = Middleware.getInstance();

  //Login user
  router.post('/login', controller.login);

  //Create user
  router.post('/signup', controller.signup);

  //Get users
  router.get('/', middleware.verifyToken, controller.getAll);
  return router;
};
