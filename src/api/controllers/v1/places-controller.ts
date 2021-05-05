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
      const {
        name,
        addressNumber,
        city,
        colony,
        latLong,
        mainStreet,
        municipality,
        state,
        type
      } = req.body;

      console.log('req.body -->', req.body);

      const place = await this.placesRepo.create({
        name,
        addressNumber,
        city,
        colony,
        latLong,
        mainStreet,
        municipality,
        state,
        type
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

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const places = await this.placesRepo.getAll();
      res.send(places);
    } catch (e) {
      sendErrorResponse(e, res);
    }
  }
}
