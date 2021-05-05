import { Router } from 'express';
import PlacesController from '../../controllers/v1/places-controller';

export default () => {
  const router = Router();
  const controller = new PlacesController();
  router.post('/create', controller.create);
  router.get('', controller.getAll);
  return router;
};
