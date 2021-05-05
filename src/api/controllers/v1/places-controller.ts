import { Request, Response } from 'express';
import autoBind from 'auto-bind';
import { Dependencies } from '../../../dependency-injection';
import PlacesRepository from '../../../domain/repositories/places-repository';
import Get from '../../../helpers/get';
import sendErrorResponse from '../utils/send-error';

export default class PlacesController {
  private placesRepo = Get.find<PlacesRepository>(Dependencies.places)!;

  constructor() {
    autoBind(this);
  }

  async create(req: Request, res: Response) {
    try {
      const place = await this.placesRepo.create({
        name: 'CC RECREO',
        addressNumber: 'S55-18',
        city: 'Quito',
        colony: 'Recreo',
        latLong: [1, 2],
        mainStreet: '',
        municipality: '',
        state: '',
        type: 'AMT'
      });

      res.send(place);
    } catch (e) {
      sendErrorResponse(e, res);
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const deleted = await this.placesRepo.deleteById('ssaskasjasj');
      res.send(deleted);
    } catch (e) {
      sendErrorResponse(e, res);
    }
  }
}
