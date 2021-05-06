import { Request, Response } from 'express';
import autoBind from 'auto-bind';
import { Dependencies } from '../../../dependency-injection';
import Get from '../../../helpers/get';
import sendErrorResponse from '../utils/send-error';
import InventoriesRepository from '../../../domain/repositories/inventories-repository';

export default class InventoriesController {
  private inventoriesRepo = Get.find<InventoriesRepository>(Dependencies.inventories);

  constructor() {
    autoBind(this);
  }

  async create(req: Request, res: Response) {
    try {
      const {
        user,
        task,
        place,
        dataCollected,
        device,
        state
      } = req.body;

      const inventory = await this.inventoriesRepo.create({
        user,
        task,
        place,
        dataCollected,
        device,
        state
      });

      res.send(inventory);
    } catch (e) {
      sendErrorResponse(e, res);
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const deleted = await this.inventoriesRepo.deleteById('ssaskasjasj');
      res.send(deleted);
    } catch (e) {
      sendErrorResponse(e, res);
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const inventories = await this.inventoriesRepo.getAll();
      res.send(inventories);
    } catch (e) {
      sendErrorResponse(e, res);
    }
  }
}
