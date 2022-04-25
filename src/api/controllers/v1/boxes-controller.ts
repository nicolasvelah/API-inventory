import { Request, Response } from 'express';
import autoBind from 'auto-bind';
import { Dependencies } from '../../../dependency-injection';
import Get from '../../../helpers/get';
import sendErrorResponse from '../utils/send-error';
import BoxesRepository from '../../../domain/repositories/boxes-respository';
import FragmentRepository from '../../../domain/repositories/fragment-repository';
import InventoriesRepository from '../../../domain/repositories/inventories-repository';
import { createRequest } from '../../../domain/models/boxes';

export default class BoxesController {
  private boxesRepo = Get.find<BoxesRepository>(Dependencies.boxes);

  private fragmentRepo = Get.find<FragmentRepository>(Dependencies.fragments);

  private inventoriesRepo = Get.find<InventoriesRepository>(Dependencies.inventories);

  constructor() {
    autoBind(this);
  }

  async get(req: Request, res: Response) {
    try {
      const boxes = await this.boxesRepo.getAll();
      const response: Array<{
        attributes: any;
        fragments: any;
      }> = [];
      for (let i = 0; i < boxes.length; i++) {
        const box = boxes[i];
        // eslint-disable-next-line no-await-in-loop
        const boxFragments = await this.fragmentRepo.getByBox(box._id);
        const fragments: Array<{
          attributes: any;
          inventory: any;
        }> = [];
        for (let o = 0; o < boxFragments.length; o++) {
          const fragment = boxFragments[o];
          // eslint-disable-next-line no-await-in-loop
          const inventory = await this.inventoriesRepo.getByFragment(fragment._id);
          const fragmentItem = {
            attributes: fragment,
            inventory
          }
          fragments.push(fragmentItem);
        }
        const item = {
          attributes: box,
          fragments
        }
        //console.log({ boxFragments });
        response.push(item);
      }
      res.send({ response });
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
