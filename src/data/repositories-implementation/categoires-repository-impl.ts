import { DocumentDefinition } from 'mongoose';
import CategoriesRepository from '../../domain/repositories/categories-repository';
import Categories from '../../domain/models/categories';
import Category from '../db/schemas/categories';

export default class CategoriesRepositoryImpl implements CategoriesRepository {
  create(data: DocumentDefinition<Categories>): Promise<Categories> {
    return Category.create(data);
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await Category.deleteOne({ _id: id });
    return (result.deletedCount ?? 0) > 0;
  }

  async getAll(): Promise<Categories[]> {
    const categories = await Category.find({});
    return categories;
  }
}
