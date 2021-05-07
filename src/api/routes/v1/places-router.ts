import { Router } from 'express';
import PlacesController from '../../controllers/v1/places-controller';
import Middleware from '../../middlewares/authentication-middleware';

export default () => {
  const router = Router();
  const middleware = Middleware.getInstance();
  const controller = new PlacesController();

  router.post('/', middleware.verifyToken, controller.create);
  router.get('/', middleware.verifyToken, controller.getAll);
  return router;
};
