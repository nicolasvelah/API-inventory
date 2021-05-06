import { Router } from 'express';
import CatalogsController from '../../controllers/v1/catalogs-controller';

export default () => {
  const router = Router();
  const controller = new CatalogsController();
  router.post('/', controller.create);
  router.delete('/:id', controller.delete);
  router.get('/', controller.getAll);
  return router;
};
