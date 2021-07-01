import { Router } from 'express';
import UsersController from '../../controllers/v1/users-controller';
//import Middleware from '../../middlewares/authentication-middleware';
import ValidateUser from '../../middlewares/validate/validate-user';

export default () => {
  const router = Router();
  const controller = new UsersController();
  // const middleware = Middleware.getInstance();

  //Login user
  router.post('/login', ValidateUser.loginValidation(), controller.login);

  //Create user
  router.post('/create', ValidateUser.createValidation(), controller.create); // put middleware.verifyToken

  //recover password
  router.post('/recover', ValidateUser.recoverValidation(), controller.recoverPassword);
  router.post(
    '/update-password',
    //middleware.verifyPublicToken,
    //ValidateUser.updatePasswordValidation(),
    controller.updatePassword
  );

  //Update user
  router.put('/:id', ValidateUser.updateValidation(), controller.update); // put middleware.verifyToken

  //Get users
  router.get('/', controller.getAll); // put middleware.verifyToken
  router.get('/search', controller.findByValue); // put middleware.verifyToken
  router.get('/id/:id', controller.getById); // put middleware.verifyToken
  router.get('/coordinators-technicals', controller.getCoordinatorsAndTechnicals); // put middleware.verifyToken

  //Delete
  router.delete('/:id', controller.deleteById); // put middleware.verifyToken

  return router;
};
