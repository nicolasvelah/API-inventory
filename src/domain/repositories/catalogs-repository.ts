/* eslint-disable semi */
/* eslint-disable no-unused-vars */
import { DocumentDefinition } from 'mongoose';
import Catalogue from '../models/catalogue';

export default interface CatalogsRepository {
  create(data: DocumentDefinition<Catalogue>): Promise<Catalogue>;
  deleteById(id: string): Promise<boolean>;
  getAll(): Promise<Catalogue[]>;
}
