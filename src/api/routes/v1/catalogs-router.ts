import { Router } from 'express';
import CatalogsController from '../../controllers/v1/catalogs-controller';
import Middleware from '../../middlewares/authentication-middleware';

export default () => {
  const router = Router();
  const middleware = Middleware.getInstance();
  const controller = new CatalogsController();

  router.post('/', controller.create);
  router.delete('/:id', middleware.verifyToken, controller.delete);
  router.get('/', controller.getAll);
  return router;
};
