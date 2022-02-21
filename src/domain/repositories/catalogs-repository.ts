/* eslint-disable semi */
/* eslint-disable no-unused-vars */
import { DocumentDefinition } from 'mongoose';
import Catalog from '../models/catalog';

export default interface CatalogsRepository {
  create(data: DocumentDefinition<Catalog>): Promise<Catalog>;
  deleteById(id: string): Promise<boolean>;
  getAll(): Promise<Catalog[]>;
}
