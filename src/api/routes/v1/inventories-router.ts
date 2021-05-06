import { Router } from 'express';
import InventoriesController from '../../controllers/v1/inventories-controller';

export default () => {
  const router = Router();
  const controller = new InventoriesController();
  router.post('/', controller.create);
  router.delete('/:id', controller.delete);
  router.get('/', controller.getAll);
  return router;
};
