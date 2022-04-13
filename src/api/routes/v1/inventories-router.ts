import { Router } from 'express';
import InventoriesController from '../../controllers/v1/inventories-controller';
import { uploadExcel } from '../../controllers/utils/file-upload';
import Middleware from '../../middlewares/authentication-middleware';
import ValidateInventory from '../../middlewares/validate/validate-inventory';

export default () => {
  const router = Router();
  const middleware = Middleware.getInstance();
  const controller = new InventoriesController();

  router.get('/getby/user', middleware.verifyToken, ValidateInventory.getByUserValidation(), controller.getByUser);
  router.post('/update/:id', middleware.verifyToken, ValidateInventory.updateValidation(), controller.update);
  router.get('/', middleware.verifyToken, controller.getAll);
  router.post('/user/update', middleware.verifyToken, ValidateInventory.updateUserValidation(), controller.updateUser);
  router.post('/', ValidateInventory.createValidation(), controller.create);

  //router.delete('/:id', middleware.verifyToken, controller.delete);
  router.post(
    '/upload-file-material',
    uploadExcel.single('file'),
    controller.addMaterialToInventory
  );

  return router;
};
