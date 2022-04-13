import { Router } from 'express';
import CatalogsController from '../../controllers/v1/catalogs-controller';
import Middleware from '../../middlewares/authentication-middleware';
import ValidateCatalogs from '../../middlewares/validate/validate-catalogs';

export default () => {
  const router = Router();
  const middleware = Middleware.getInstance();
  const controller = new CatalogsController();

  router.get('/', middleware.verifyToken, ValidateCatalogs.getAllValidation(), controller.getAll);
  router.post('/', middleware.verifyToken, ValidateCatalogs.createValidation(), controller.create);
  //router.delete('/:id', middleware.verifyToken, controller.delete);
  return router;
};
