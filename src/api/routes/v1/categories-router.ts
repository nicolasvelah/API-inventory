import { Router } from 'express';
import CategoriesController from '../../controllers/v1/categories-controller';
import Middleware from '../../middlewares/authentication-middleware';
import ValidateCategories from '../../middlewares/validate/validate-categories';

export default () => {
  const router = Router();
  const middleware = Middleware.getInstance();
  const controller = new CategoriesController();

  router.post('/', middleware.verifyToken, ValidateCategories.createValidation(), controller.create);
  //router.delete('/:id', middleware.verifyToken, controller.delete);
  router.get('/', middleware.verifyToken, controller.getAll);
  return router;
};
