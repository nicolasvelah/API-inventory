import { DocumentDefinition } from 'mongoose';
import Place from '../../domain/models/place';
import PlacesRepository from '../../domain/repositories/places-repository';
import Places from '../db/schemas/places';

export default class PlacesRepositoryImpl implements PlacesRepository {
  create(data: DocumentDefinition<Place>): Promise<Place> {
    return Places.create(data);
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await Places.deleteOne({ _id: id });
    return (result.deletedCount ?? 0) > 0;
  }

  async getAll(): Promise<Place[]> {
    const places = await Places.find({})
      .populate({
        path: 'IntalledMaterial',
        select: ['-createdAt', '-updatedAt', '-__v', '-place', '-user', '-task'],
        populate: [
          {
            path: 'device',
            select: ['-createdAt', '-updatedAt', '-__v'],
            populate: [
              {
                path: 'categoryId',
                select: ['-createdAt', '-updatedAt', '-__v'],
              }
            ]
          },
          {
            path: 'fragment',
            select: ['-createdAt', '-updatedAt', '-__v', '-owner', '-remainingFragment', '-totalFragment'],
            populate: [
              {
                path: 'box',
                select: ['-createdAt', '-updatedAt', '-__v', '-remainingMaterial', '-totalMaterial', '-device'],
              }
            ]
          }
        ]
      });
    return places;
  }
}
