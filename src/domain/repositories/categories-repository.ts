/* eslint-disable semi */
/* eslint-disable no-unused-vars */
import { DocumentDefinition } from 'mongoose';
import Categories from '../models/categories';

export default interface CategoriesRepository {
  create(data: DocumentDefinition<Categories>): Promise<Categories>;
  deleteById(id: string): Promise<boolean>;
  getAll(): Promise<Categories[]>;
}
