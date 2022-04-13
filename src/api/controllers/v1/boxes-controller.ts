import { Request, Response } from 'express';
import autoBind from 'auto-bind';
import { Dependencies } from '../../../dependency-injection';
import Get from '../../../helpers/get';
import sendErrorResponse from '../utils/send-error';
import BoxesRepository from '../../../domain/repositories/boxes-respository';
import { createRequest } from '../../../domain/models/boxes';

export default class BoxesController {
  private boxesRepo = Get.find<BoxesRepository>(Dependencies.boxes);

  constructor() {
    autoBind(this);
  }

  async get(req: Request, res: Response) {
    try {
      const boxes = await this.boxesRepo.getAll();
      res.send({ boxes });
    } catch (e) {
      sendErrorResponse(e, res);
    }
  }

  async create(req: Request, res: Response) {
    try {
      const {
        catalogId,
        totalMaterial,
        dataCollected
      }: createRequest = req.body;

      const data = {
        device: catalogId,
        totalMaterial,
        remainingMaterial: totalMaterial,
        dataCollected
      }
      const boxes = await this.boxesRepo.create(data);
      res.send({ boxes });
    } catch (e) {
      sendErrorResponse(e, res);
    }
  }
}
