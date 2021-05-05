/* eslint-disable semi */
/* eslint-disable no-unused-vars */
import { DocumentDefinition } from 'mongoose';
import Place from '../models/place';

export default interface PlacesRepository {
  create(data: DocumentDefinition<Place>): Promise<Place>;
  deleteById(id: string): Promise<boolean>;
}
