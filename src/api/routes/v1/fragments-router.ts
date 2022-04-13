import { Router } from 'express';
import FragmentsController from '../../controllers/v1/fragments-controller';
import Middleware from '../../middlewares/authentication-middleware';
import ValidateFragments from '../../middlewares/validate/validate-fragments';

export default () => {
  const router = Router();
  const middleware = Middleware.getInstance();
  const controller = new FragmentsController();

  router.post('/', middleware.verifyToken, ValidateFragments.createValidation(), controller.create);

  return router;
};
