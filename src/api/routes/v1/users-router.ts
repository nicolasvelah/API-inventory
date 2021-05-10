import { Router } from 'express';
import UsersController from '../../controllers/v1/users-controller';
import Middleware from '../../middlewares/authentication-middleware';
import ValidateUser from '../../middlewares/validate/validate-user';

export default () => {
  const router = Router();
  const controller = new UsersController();
  const middleware = Middleware.getInstance();

  //Login user
  router.post('/login', ValidateUser.loginValidation(), controller.login);

  //Create user
  router.post('/create', ValidateUser.createValidation(), controller.create); // put middleware.verifyToken

  //recover password
  router.post('/recover', controller.recoverPassword);
  router.post('/update-password', middleware.verifyPublicToken, controller.updatePassword);

  //Get users
  router.get('/', controller.getAll); // put middleware.verifyToken
  return router;
};
