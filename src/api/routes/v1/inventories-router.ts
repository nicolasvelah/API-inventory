import { Router } from 'express';
import InventoriesController from '../../controllers/v1/inventories-controller';
import { uploadExcel } from '../../controllers/utils/file-upload';
import Middleware from '../../middlewares/authentication-middleware';

export default () => {
  const router = Router();
  const middleware = Middleware.getInstance();
  const controller = new InventoriesController();

  router.post('/', middleware.verifyToken, controller.create);
  router.delete('/:id', middleware.verifyToken, controller.delete);
  router.get('/', controller.getAll);
  router.get('/getby/user', controller.getByUser);

  router.post(
    '/upload-file-material',
    uploadExcel.single('file'),
    controller.addMaterialToInventory
  );

  return router;
};
