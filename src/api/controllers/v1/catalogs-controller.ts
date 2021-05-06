import { Request, Response } from 'express';
import autoBind from 'auto-bind';
import { Dependencies } from '../../../dependency-injection';
import Get from '../../../helpers/get';
import sendErrorResponse from '../utils/send-error';
import CatalogsRepository from '../../../domain/repositories/catalogs-repository';

export default class CatalogsController {
  private catalogsRepo = Get.find<CatalogsRepository>(Dependencies.catalogs);

  constructor() {
    autoBind(this);
  }

  async create(req: Request, res: Response) {
    try {
      const { brand, dataToCollectInterface, device, referenceModel, typePlace } = req.body;

      const inventory = await this.catalogsRepo.create({
        brand,
        dataToCollectInterface,
        device,
        referenceModel,
        typePlace
      });

      res.send(inventory);
    } catch (e) {
      sendErrorResponse(e, res);
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const deleted = await this.catalogsRepo.deleteById('ssaskasjasj');
      res.send(deleted);
    } catch (e) {
      sendErrorResponse(e, res);
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const inventories = await this.catalogsRepo.getAll();
      res.send(inventories);
    } catch (e) {
      sendErrorResponse(e, res);
    }
  }
}
