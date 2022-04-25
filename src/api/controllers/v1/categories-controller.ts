import { Request, Response } from 'express';
import autoBind from 'auto-bind';
import { Dependencies } from '../../../dependency-injection';
import Get from '../../../helpers/get';
import sendErrorResponse from '../utils/send-error';
import CategoriesRepository from '../../../domain/repositories/categories-repository';

export default class CategoriesController {
  private categoriesRepo = Get.find<CategoriesRepository>(Dependencies.categories);

  constructor() {
    autoBind(this);
  }

  async create(req: Request, res: Response) {
    try {
      const { name, description } = req.body;

      const inventory = await this.categoriesRepo.create({
        name,
        description
      });

      res.send(inventory);
    } catch (e) {
      sendErrorResponse(e, res);
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const deleted = await this.categoriesRepo.deleteById('ssaskasjasj');
      res.send(deleted);
    } catch (e) {
      sendErrorResponse(e, res);
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const inventories = await this.categoriesRepo.getAll();
      res.send(inventories);
    } catch (e) {
      sendErrorResponse(e, res);
    }
  }
}
