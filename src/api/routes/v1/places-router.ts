import { Router } from 'express';
import PlacesController from '../../controllers/v1/places-controller';
import Middleware from '../../middlewares/authentication-middleware';

export default () => {
  const router = Router();
  const middleware = Middleware.getInstance();
  const controller = new PlacesController();

  router.post('/create', controller.create);
  router.get('/', controller.getAll); // put middleware.verifyToken
  return router;
};
