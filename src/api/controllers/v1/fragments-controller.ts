import { Request, Response } from 'express';
import autoBind from 'auto-bind';
import { Dependencies } from '../../../dependency-injection';
import Get from '../../../helpers/get';
import sendErrorResponse from '../utils/send-error';
import FragmentRepository from '../../../domain/repositories/fragment-repository';
import { FragmentsCreateRequest } from '../../../domain/models/fragment';

export default class FragmentsController {
  private fragmentsRepo = Get.find<FragmentRepository>(Dependencies.fragments);

  constructor() {
    autoBind(this);
  }

  async create(req: Request, res: Response) {
    try {
      const { data }: {data:Array<FragmentsCreateRequest>} = req.body;
      const response = []
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        console.log({ item });
        const fragmentData = {
          owner: item.userId,
          box: item.boxId,
          remainingFragment: item.quantity,
          totalFragment: item.quantity
        }
        // eslint-disable-next-line no-await-in-loop
        const fragment = await this.fragmentsRepo.create(fragmentData);
        response.push(fragment);
      }
      res.send({ data: response });
    } catch (e) {
      sendErrorResponse(e, res);
    }
  }
}
