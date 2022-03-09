import { Router } from 'express';
import CategoriesController from '../../controllers/v1/categories-controller';
import Middleware from '../../middlewares/authentication-middleware';

export default () => {
  const router = Router();
  const middleware = Middleware.getInstance();
  const controller = new CategoriesController();

  router.post('/', controller.create);
  router.delete('/:id', middleware.verifyToken, controller.delete);
  router.get('/', controller.getAll);
  return router;
};
