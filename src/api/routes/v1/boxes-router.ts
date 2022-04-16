import { Router } from 'express';
import BoxesController from '../../controllers/v1/boxes-controller';
import Middleware from '../../middlewares/authentication-middleware';
import ValidateBoxes from '../../middlewares/validate/validate-boxes';

export default () => {
  const router = Router();
  const middleware = Middleware.getInstance();
  const controller = new BoxesController();

  router.get('/', controller.get);
  router.post('/', middleware.verifyToken, ValidateBoxes.createValidation(), controller.create);

  return router;
};
