/* eslint-disable semi */
/* eslint-disable no-unused-vars */
import { DocumentDefinition } from 'mongoose';
import Boxes from '../models/boxes';

export default interface CategoriesRepository {
  create(data: DocumentDefinition<Boxes>): Promise<Boxes>;
  deleteById(id: string): Promise<boolean>;
  getAll(): Promise<Boxes[]>;
  update(id: string, data: DocumentDefinition<Boxes>): Promise<Boxes | null>;
}
