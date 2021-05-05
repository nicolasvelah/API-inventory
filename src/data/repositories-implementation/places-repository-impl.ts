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
}
